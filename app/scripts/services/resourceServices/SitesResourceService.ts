/// <reference path="../References.d.ts" />

module Services.Resources {

    export class SitesResourceService {

        private promiseService;
        private environmentService;
        private httpService;
        private addressService;

        constructor(promiseService, environmentService, httpService, addressService) {
            this.promiseService = promiseService;
            this.environmentService = environmentService;
            this.httpService = httpService;
            this.addressService = addressService;
        }

        public recent() {
            return this.filter();
        }

        public opportunities() {
            return this.filter({ stage_name: 'lead' }, 'updated_at');
        }

        public contracts() {
            return this.filter({ stage_name: 'contract' }, 'updated_at');
        }

        public productions() {
            return this.filter({ stage_name: 'production' }, 'updated_at');
        }

        public billings() {
            return this.filter({ stage_name: 'billing' }, 'updated_at');
        }

        public filter(filter = null, sort = '-updated_at') {
            var request = {
                include: 'customer,address',
                sort: sort
            };

            if(filter)
                request['filter'] = filter;

            return this.get(this.environmentService.apiEndpoint + '/api/v2/sites', request);
        }

        public get(url, request) {
            var defer = this.promiseService.defer();
            if (request)
                url += '?' + jQuery.param(request);

            this.httpService.get(url)
                .then((response) => defer.resolve(this.parse(response.data)))
                .catch((error) => defer.reject(error));

            return defer.promise;
        }

        public parse(response) {
            /* Build up dictionary for quick lookup */
            var includedDictionary = {};
            angular.forEach(response.included, (include) => includedDictionary[include.type + '-' + include.id] = include);

            if (response && response.data) {
                if (angular.isArray(response.data))
                    response = this.parseCollection(response, includedDictionary);
                else if (angular.isObject(response.data))
                    response = this.parseObject(response, includedDictionary);
            }

            return response;
        }

        public parseCollection (response, includedDictionary) {
            response.items = [];

            /* Process each item in collection */
            angular.forEach(response.data, (rawItem) => {
                var item = this.parseObject(rawItem, includedDictionary);
                response.items.push(item);
            });

            /* Append count */
            if(response.meta)
                response.meta.count = response.meta['record-count'];

            return response;
        }

        public parseObject (rawItem, includedDictionary) {
            var item = rawItem.attributes;
            item.id = rawItem.id;

            /* Add includes */
            angular.forEach(rawItem.relationships, (relationship, name) => {
                if(!relationship.data)
                    return;

                if(angular.isArray(relationship.data)) {
                    item[name] = [];
                    angular.forEach(relationship.data, (relationshipItem) => item[name].push(this.parseRelationship(relationshipItem, includedDictionary)));
                } else
                    item[name] = this.parseRelationship(relationship.data, includedDictionary);
            });

            /* Add address states abbreviation */
            if(rawItem.type === 'addresses')
                item.state = this.addressService.StatesDictionary[item['state-id']];

            /* Prepare snapshot for change tracking */
            var snapShot = this.stripFunctions(item);

            /* Add save method */
            if(rawItem.links.self) {
                item.save = () => {
                    var model = this.stripFunctions(item);
                    var diff = jsondiffpatch.diff(model, snapShot);
                    var changes = {};
                    angular.forEach(diff, (value, field) => changes[field] = value[0]);
                    var request = {
                        data: {
                            attributes: changes,
                            type: rawItem.type,
                            id: rawItem.id
                        }
                    };
                    return this.httpService.put(rawItem.links.self, request, {
                        headers: {
                            'Content-Type': 'application/vnd.api+json'
                        }
                    });
                };
            }

            return item;
        }

        public parseRelationship(relationship, includedDictionary) {
            var relationshipRawItem = includedDictionary[relationship.type + '-' + relationship.id];
            return this.parseObject(relationshipRawItem, includedDictionary);
        }

        public stripFunctions(item) {
            var result = angular.copy(item);
            angular.forEach(result, (value, field) => {
                if(angular.isFunction(value))
                    delete result[field];
                if(angular.isObject(value))
                    result[field] = this.stripFunctions(result[field]);
            });
            return result;
        }

    }

    angular.module('sitesService').factory('SitesResourceService', [
        '$q',
        'ENV',
        '$http',
        'Address',
        (promiseService, environmentService, httpService, addressService) => {
            return new SitesResourceService(promiseService, environmentService, httpService, addressService);
        }
    ]);

}

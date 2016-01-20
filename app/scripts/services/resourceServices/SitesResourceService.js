(function() {

    /* Sites service class */
    (function (angular, jQuery) {

        /* Constructor */
        function SitesResourceService(promiseService, environmentService, httpService) {
            this.promiseService = promiseService;
            this.environmentService = environmentService;
            this.httpService = httpService;
        }

        /* Sites service specific functions */
        SitesResourceService.prototype.filter = function (filter) {
            var request = {
                include: 'customer,address',
                sort: '-updated_at'
            };
            if(filter)
                request['filter'] = filter;
            return this.get(this.environmentService.apiEndpoint + '/api/v2/sites', request);
        };

        /* Resource service utilities. This should ideally move to a base class. */
        SitesResourceService.prototype.get = function (url, request) {
            var _this = this;
            var defer = this.promiseService.defer();
            if (request)
                url += '?' + jQuery.param(request);
            this.httpService.get(url).then(function (response) {
                defer.resolve(_this.parse(response.data));
            }).catch(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        SitesResourceService.prototype.parse = function (response) {
            if (response && response.data) {
                if (angular.isArray(response.data))
                    response = this.parseCollection(response);
                else if (angular.isObject(response.data))
                    response = this.parseObject(response);
            }

            return response;
        };

        SitesResourceService.prototype.parseCollection = function (response) {
            response.items = [];

            /* Build up dictionary for quick lookup */
            var includedDictionary = {};
            angular.forEach(response.included, function(include) {
                includedDictionary[include.type + '-' + include.id] = include;
            });

            /* Process each item in collection */
            angular.forEach(response.data, function (rawItem) {
                var item = SitesResourceService.prototype.parseObject(rawItem, includedDictionary);
                response.items.push(item);
            });

            if(response.meta)
                response.meta.count = response.meta['record-count'];

            return response;
        };

        SitesResourceService.prototype.parseObject = function (rawItem, includedDictionary) {
            var _this = this;
            var item = rawItem.attributes;
            item.id = rawItem.id;

            /* Add includes */
            angular.forEach(rawItem.relationships, function(relationship, name) {
                if(!relationship.data)
                    return;

                if(angular.isArray(relationship.data)) {
                    item[name] = [];
                    angular.forEach(relationship.data, function(relationshipItem) {
                        item[name].push(_this.parseRelationship(item, relationshipItem, includedDictionary));
                    });
                } else {
                    item[name] = _this.parseRelationship(item, relationship.data, includedDictionary);
                }
            });

            return item;
        };

        SitesResourceService.prototype.parseRelationship = function(item, relationship, includedDictionary) {
            var relationshipRawItem = includedDictionary[relationship.type + '-' + relationship.id];
            return this.parseObject(relationshipRawItem);
        };

        angular.module('sitesService').factory('SitesResourceService', [
            '$q',
            'ENV',
            '$http',
            function (promiseService, environmentService, httpService) {
                return new SitesResourceService(promiseService, environmentService, httpService);
            }
        ]);

    })(angular, jQuery);

})();
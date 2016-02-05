/// <reference path="../References.d.ts" />
var Services;
(function (Services) {
    var Resources;
    (function (Resources) {
        var SitesResourceService = (function () {
            function SitesResourceService(promiseService, environmentService, httpService, addressService) {
                this.promiseService = promiseService;
                this.environmentService = environmentService;
                this.httpService = httpService;
                this.addressService = addressService;
            }
            SitesResourceService.prototype.recent = function () {
                return this.filter();
            };
            SitesResourceService.prototype.opportunities = function () {
                return this.filter({ stage_name: 'lead' }, 'updated_at');
            };
            SitesResourceService.prototype.contracts = function () {
                return this.filter({ stage_name: 'contract' }, 'updated_at');
            };
            SitesResourceService.prototype.productions = function () {
                return this.filter({ stage_name: 'production' }, 'updated_at');
            };
            SitesResourceService.prototype.billings = function () {
                return this.filter({ stage_name: 'billing' }, 'updated_at');
            };
            SitesResourceService.prototype.filter = function (filter, sort) {
                if (filter === void 0) { filter = null; }
                if (sort === void 0) { sort = '-updated_at'; }
                var request = {
                    include: 'customer,address',
                    sort: sort
                };
                if (filter)
                    request['filter'] = filter;
                return this.get(this.environmentService.apiEndpoint + '/api/v2/sites', request);
            };
            SitesResourceService.prototype.get = function (url, request) {
                var _this = this;
                var defer = this.promiseService.defer();
                if (request)
                    url += '?' + jQuery.param(request);
                this.httpService.get(url)
                    .then(function (response) { return defer.resolve(_this.parse(response.data)); })
                    .catch(function (error) { return defer.reject(error); });
                return defer.promise;
            };
            SitesResourceService.prototype.parse = function (response) {
                /* Build up dictionary for quick lookup */
                var includedDictionary = {};
                angular.forEach(response.included, function (include) { return includedDictionary[include.type + '-' + include.id] = include; });
                if (response && response.data) {
                    if (angular.isArray(response.data))
                        response = this.parseCollection(response, includedDictionary);
                    else if (angular.isObject(response.data))
                        response = this.parseObject(response, includedDictionary);
                }
                return response;
            };
            SitesResourceService.prototype.parseCollection = function (response, includedDictionary) {
                var _this = this;
                response.items = [];
                /* Process each item in collection */
                angular.forEach(response.data, function (rawItem) {
                    var item = _this.parseObject(rawItem, includedDictionary);
                    response.items.push(item);
                });
                return response;
            };
            SitesResourceService.prototype.parseObject = function (rawItem, includedDictionary) {
                var _this = this;
                var item = rawItem.attributes;
                item.id = rawItem.id;
                /* Add includes */
                angular.forEach(rawItem.relationships, function (relationship, name) {
                    if (!relationship.data)
                        return;
                    if (angular.isArray(relationship.data)) {
                        item[name] = [];
                        angular.forEach(relationship.data, function (relationshipItem) { return item[name].push(_this.parseRelationship(relationshipItem, includedDictionary)); });
                    }
                    else
                        item[name] = _this.parseRelationship(relationship.data, includedDictionary);
                });
                /* Add address states abbreviation */
                if (rawItem.type === 'addresses')
                    item.state = this.addressService.StatesDictionary[item['stateId']];
                /* Prepare snapshot for change tracking */
                var snapShot = this.stripFunctions(item);
                /* Add save method */
                if (rawItem.links.self) {
                    item.save = function () {
                        var model = _this.stripFunctions(item);
                        var diff = jsondiffpatch.diff(model, snapShot);
                        var changes = {};
                        angular.forEach(diff, function (value, field) { return changes[field] = value[0]; });
                        var request = {
                            data: {
                                attributes: changes,
                                type: rawItem.type,
                                id: rawItem.id
                            }
                        };
                        return _this.httpService.put(rawItem.links.self, request, {
                            headers: {
                                'Content-Type': 'application/vnd.api+json'
                            }
                        });
                    };
                }
                return item;
            };
            SitesResourceService.prototype.parseRelationship = function (relationship, includedDictionary) {
                var relationshipRawItem = includedDictionary[relationship.type + '-' + relationship.id];
                return this.parseObject(relationshipRawItem, includedDictionary);
            };
            SitesResourceService.prototype.stripFunctions = function (item) {
                var _this = this;
                var result = angular.copy(item);
                angular.forEach(result, function (value, field) {
                    if (angular.isFunction(value))
                        delete result[field];
                    if (angular.isObject(value))
                        result[field] = _this.stripFunctions(result[field]);
                });
                return result;
            };
            return SitesResourceService;
        })();
        Resources.SitesResourceService = SitesResourceService;
        angular.module('sitesService').factory('SitesResourceService', [
            '$q',
            'ENV',
            '$http',
            'Address',
            function (promiseService, environmentService, httpService, addressService) {
                return new SitesResourceService(promiseService, environmentService, httpService, addressService);
            }
        ]);
    })(Resources = Services.Resources || (Services.Resources = {}));
})(Services || (Services = {}));
//# sourceMappingURL=SitesResourceService.js.map
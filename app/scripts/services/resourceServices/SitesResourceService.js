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
        SitesResourceService.prototype.recent = function (paginatedRequest) {
            return this.get(this.environmentService.apiEndpoint + '/api/v2/sites');
        };

        /* Resource service utilities. This should ideally move to a base class. */
        SitesResourceService.prototype.get = function (url, request) {
            var defer = this.promiseService.defer();
            if (request)
                url += '?' + jQuery.param(request);
            this.httpService.get(url).then(function (response) {
                defer.resolve(this.parse(response));
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

        SitesResourceService.prototype.parseObject = function (response) {
            return response;
        };

        SitesResourceService.prototype.parseCollection = function (response) {
            response.items = [];
            angular.forEach(response.data, function (rawItem) {
                var item = rawItem.attributes;
                item.id = rawItem.id;
                response.items.push(item);
            });
            return response;
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
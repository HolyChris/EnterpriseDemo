var overviewService = angular.module('overviewService', ['ngResource']);

overviewService.factory('Overview', function ($resource, ENV) {
    return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId', {siteId: '@siteId'}, {
        query: {method: "GET", isArray: false},
        put: {method: "PUT"},
        post: {method: "POST"},
    });
});

overviewService.factory('Contract', function ($resource, ENV, $location) {
    return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/contract/', {siteId: '@siteId'}, {
        query: {method: "GET", isArray: false},
        put: {method: "PUT", headers: {'Content-Type': undefined}},
        post: {method: "POST", headers: {'Content-Type': undefined}},
    });
});

overviewService.factory('Portal', function (ENV, $location, $http) {
    return {
        sendToCustomer: function(id) {
            return $http.post(ENV.apiEndpoint + '/api/v1/sites/' + id + '/contract/send_to_customer', {});
        },
        sendToInsuranceAdjustor: function(id) {
            return $http.post(ENV.apiEndpoint + '/api/v1/sites/' + id + '/contract/send_to_insurance_adjustor', {});
        }
    };
});

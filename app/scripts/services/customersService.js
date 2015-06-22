var sitesService = angular.module('customersService', ['ngResource']);

sitesService.factory('Customer', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/customers', {}, {
    query: {method: "GET", isArray: false},
    search: {method: "GET", isArray: false}
  });
});
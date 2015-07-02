var customerService = angular.module('customersService', ['ngResource']);

customerService.factory('Customer', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/customers/:id', {id: '@id'}, {
    query: {method: "GET", isArray: false},
    save: {
      method: "PUT"
    },
    search: {method: "GET", isArray: false}
  });
});

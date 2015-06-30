var sitesService = angular.module('customersService', ['ngResource']);

sitesService.factory('Customer', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/customers/:id', {id: '@id'}, {
    query: {method: "GET", isArray: false},
    save: {
      method: "PUT", 
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    },
    search: {method: "GET", isArray: false}
  });
});

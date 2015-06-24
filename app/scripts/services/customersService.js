var sitesService = angular.module('customersService', ['ngResource']);

sitesService.factory('Customer', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/customers/:id', {id: '@id'}, {
    query: {method: "GET", isArray: false},
    save: {method: "PUT", transformRequest: function(data, headers) {
      $.extend(data, data.customer);
      return angular.toJson(data);
    }},
    search: {method: "GET", isArray: false}
  });
});
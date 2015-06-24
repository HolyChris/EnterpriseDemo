var managersService = angular.module('managersService', ['ngResource']);

managersService.factory('Managers', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/users', {}, {
    query: {method: "GET", isArray: false}
  });
});
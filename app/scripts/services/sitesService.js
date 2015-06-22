var sitesService = angular.module('sitesService', ['ngResource']);

sitesService.factory('Sites', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites', {}, {
    query: {method: "GET", isArray: false}
  });
});
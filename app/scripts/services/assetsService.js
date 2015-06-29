var assetsService = angular.module('assetsService', ['ngResource']);

assetsService.factory('Documents', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/documents', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    save: {method: "PUT", transformRequest: function(data, headers) {
      $.extend(data, data.site);
      return angular.toJson(data);
    }}
  });
});

assetsService.factory('Images', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/images', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    save: {method: "PUT", transformRequest: function(data, headers) {
      $.extend(data, data.site);
      return angular.toJson(data);
    }}
  });
});
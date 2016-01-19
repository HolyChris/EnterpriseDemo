var sitesService = angular.module('sitesService', ['ngResource']);

sitesService.factory('Sites', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    save: {method: "PUT", transformRequest: function(data, headers) {
      $.extend(data, data.site);
      return angular.toJson(data);
    }},
    post: {method: "POST"},
    upload_coverphoto: {method: "PUT", headers: { 'Content-Type': undefined }}
  });
});

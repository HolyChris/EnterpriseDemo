var assetsService = angular.module('assetsService', ['ngResource']);

assetsService.factory('Documents', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/documents', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    save: {method: "POST", headers: { 'Content-Type': undefined }},
  });
});

assetsService.factory('Images', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/images', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    save: {method: "POST", headers: { 'Content-Type': undefined }},
  });
});

assetsService.factory('Assets', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/assets/:assetId', {siteId:'@siteId', assetId:'@assetId'}, {
    query: {method: "GET", isArray: false},
    save: {method: "POST", headers: { 'Content-Type': undefined }},
    update: {method: "PUT", headers: { 'Content-Type': undefined }},
    delete: {method: "DELETE", headers: { 'Content-Type': undefined }}
  });
});
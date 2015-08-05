var overviewService = angular.module('overviewService', ['ngResource']);

overviewService.factory('Overview', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    put: {method: "PUT"},
    post: {method: "POST"},
  });
});

overviewService.factory('Contract', function($resource, ENV, $location) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/contract/', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
    put: {method: "PUT"},
    post: {method: "POST", headers: { 'Content-Type': undefined }},
  });
});

overviewService.factory('Portal', function($resource, ENV, $location) {
  return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/contract/send_to_customer', {siteId:'@siteId'}, {
    query: {method: "GET", isArray: false},
  });
});

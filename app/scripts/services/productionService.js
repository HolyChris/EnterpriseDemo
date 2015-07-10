angular.module('productionService', ['ngResource'])
  .factory('Production', function($resource, ENV) {
    return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/productions', {siteId: '@siteId', productionId: '@productionId'}, {
      query: {
        method: "GET", 
        isArray: false, 
        url: ENV.apiEndpoint + '/api/v1/sites/:siteId/productions/:productionId'
      },
      save: {
        method: "POST"
      },
      update: {
        method: 'PUT',
        url: ENV.apiEndpoint + '/api/v1/sites/:siteId/productions/:productionId'
      },
      search: {
        method: "GET", 
        isArray: false
      }
    });
  });
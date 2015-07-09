angular.module('billingService', ['ngResource'])
  .factory('Billing', function($resource, ENV) {
    return $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/billings', {siteId: '@siteId', billingId: '@billingId'}, {
      query: {
        method: "GET", 
        isArray: false, 
        url: ENV.apiEndpoint + '/api/v1/sites/:siteId'
      },
      save: {
        method: "POST"
      },
      update: {
        method: 'PUT',
        url: ENV.apiEndpoint + '/api/v1/sites/:siteId/billings/:billingId'
      },
      search: {
        method: "GET", 
        isArray: false
      }
    });
  });
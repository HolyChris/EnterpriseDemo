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
  var resource = $resource(ENV.apiEndpoint + '/api/v1/sites/:siteId/assets/:assetId', {siteId:'@siteId', assetId:'@assetId', per_page:100}, {
    query: {method: "GET", isArray: false},
    save: {method: "POST", headers: { 'Content-Type': undefined }},
    update: {method: "PUT", headers: { 'Content-Type': undefined }},
    delete: {method: "DELETE"}
  });

  var stages = [
    {title:'Opportunity',id:'1'},
    {title:'Under Contract',id:'2'},
    {title:'Production',id:'4'},
    {title:'Billing',id:'5'}
  ]

  var docTypes = [
    {title:'Billing Reference Document',id:'1'},
    {title:'Completion Payment Check',id:'2'},
    {title:'Customer Invoice',id:'3'},
    {title:'Deductible Check',id:'4'},
    {title:'EagleView',id:'5'},
    {title:'HOA Approval Document',id:'6'},
    {title:'Initial Payment Check',id:'7'},
    {title:'Insurance scope document',id:'8'},
    {title:'Material List',id:'9'},
    {title:'Supplement Documentation',id:'10'},
    {title:'Trade work Bid',id:'11'},
    {title:'Xactimate',id:'12'},
    {title:'Other',id:'13'}
  ]

  var findDocType = function findDocType(docType) {
    var id = 1;
    angular.forEach(docTypes, function(value, key) {
      if (value.title === docType) {
        id = value.id;
      }
    });
    return id;
  }

  var findStage = function findStage(stage) {
    var id = 1;
    angular.forEach(stages, function(value, key) {
      if (value.title === stage) {
        id = value.id;
      }
    });
    return id;
  }

  return {
    resource: resource,
    docTypes: docTypes,
    stages: stages,
    findDocType: findDocType,
    findStage: findStage,
  }
});

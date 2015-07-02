'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AssetsCtrl', function($scope, $location, $http, ENV, Flash, Overview, Contract,Customer,Sites,usSpinnerService,Managers,Documents,Images,Assets) {

})

.directive('ngUploadForm', ['$rootScope', 'fileUpload', function () {
  return {
    restrict: 'E',
    templateUrl: './views/fileform.html',
    scope: {
      allowed: '@',
      url: '@',
      autoUpload: '@',
      sizeLimit: '@',
      ngModel: '=',
      name: '@'
    },
    controller: function ($rootScope, $stateParams, $scope, $element, $auth, fileUpload, Images, Documents, Assets, ENV) {
      var authToken = $auth.getToken();
      console.log(authToken);

      $scope.$on('fileuploadsubmit', function (e, data) {
        var fd = new FormData();

        angular.forEach(data.files, function(value, key) {
          var file = {file: value}
          fd.append('attachments_attributes[][file]', value);
        });
        fd.append('title', 'test');
        fd.append('type', 'Image');
        fd.append('stage', 1);

        data.contentType = undefined;
        data.data = fd;
        // data.headers = {"X-Auth-Token": authToken, "Content-Type": undefined, };
        // Assets.save({siteId: projectId}, fd, function(data) {
        //   console.log(data);
        // }, function(error) {
        //   console.log(error)
        // });
      }, function(error) {
        console.log('error', error);
      });

      $scope.$on('fileuploaddone', function (e, data) {
        fileUpload.addFieldData($scope.name, data._response.result.files[0].result);
        console.log('hola');
      });

      $scope.show = 'All';
      $scope.showImages = function() {
        $scope.show = 'Image';
        console.log($scope.show);
      }
      $scope.showDocuments = function() {
        $scope.show = 'Document';
        console.log($scope.show);
      }
      $scope.showAll = function() {
        $scope.show = 'All';
        console.log($scope.show);
      }

      $scope.isImage = function(fileType) {
        if (fileType && typeof fileType ==='string' && (fileType === 'Image' || fileType.indexOf('jpeg') > -1 || fileType.indexOf('gif') > -1 || fileType.indexOf('png') > -1)) {
          return true;
        } else {
          return false;
        }
      }

      var projectId = $stateParams.projectId;
      var url = ENV.apiEndpoint + '/api/v1/sites/' + projectId + '/assets';
      var dropzone = angular.element('#drop-zone');

      $scope.options = {
        url: url,
        dropZone: $('#drop-zone'),
        maxFileSize: $scope.sizeLimit,
        autoUpload: false,
        headers: {
          "X-Auth-Token": authToken, 
          "Content-Type": 'undefined', 
        }
      };
      $scope.loadingFiles = false;
      $scope.docTypes = [
        {title:'Billing Reference Document',id:'1'},
        {title:'Completion Payment Check',id:'2'},
        {title:'Customer Invoice',id:'3'},
        {title:'Deductive Check',id:'4'},
        {title:'EagleView',id:'5'},
        {title:'HOA Approval Document',id:'6'},
        {title:'Initial Payment Check',id:'7'},
        {title:'Insurance scope document',id:'8'},
        {title:'Material List',id:'9'},
        {title:'Supplement Documentation',id:'10'},
        {title:'Trade work Bid',id:'11'},
        {title:'Xactmate',id:'12'},
        {title:'Other',id:'13'}
      ]
      $scope.stages = [
        {title:'Lead',id:'1'},
        {title:'Contract',id:'2'},
        {title:'Project',id:'3'},
        {title:'Production',id:'4'},
        {title:'Billing',id:'5'}
      ]

      $scope.assets = Assets.query({siteId: projectId}, function(data) {
        generateFileObject(data.assets);
      }, function(error) {
        console.log(error);
      });

      if (!$scope.queue) {
        $scope.queue = [];
      }

      var generateFileObject = function generateFileObjects(objects) {
        angular.forEach(objects, function (value, key) {
          var fileObject = {
            name: value.title,
            file_name: value.attachments[0].file_name,
            url: value.attachments[0].url,
            thumbnailUrl: value.attachments[0].url,
            deleteUrl: url + '/' + value.attachments[0].id,
            deleteType: 'DELETE',
            doc_type: value.doc_type,
            notes: value.notes,
            stage: value.stage,
            type: value.type,
            siteId: projectId,
            result: value
          };
          $scope.queue[key] = fileObject;
        });
      };

      fileUpload.registerField($scope.name);
      $scope.filequeue = fileUpload.fieldData[$scope.name];

      $scope.$watchCollection('filequeue', function (newval) {
        generateFileObject(newval);
      });
    }
  };
}])
.controller('FileDestroyController', ['$rootScope', '$scope', '$http', 'fileUpload', 'Assets', function ($rootScope, $scope, $http, fileUpload, Assets) {
  var file = $scope.file,
    state;

  if ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.$parent.name) {
    $scope.fieldname = $scope.$parent.$parent.$parent.name;
  }

  if (!fileUpload.fieldData[$scope.name]) {
    fileUpload.fieldData[$scope.name] = [];
  }

  $scope.filequeue = fileUpload.fieldData;

  if (file.url) {
    file.$state = function () {
      return state;
    };
    file.$update = function (file) {
      state = 'pending';
      var stage = findStage(file.stage);
      var fd = new FormData();
      fd.append('title', file.name);
      fd.append('type', file.type);
      fd.append('notes', file.notes);
      fd.append('stage', stage);
      if (file.type === 'Document') {
        var docType = findDocType(file.doc_type)
        fd.append('doc_type', docType);
      }

      Assets.update({siteId: file.siteId, assetId: file.result.id}, fd, function(data) {
        console.log(data);
        state = 'resolved';
      }, function(error) {
        console.log(error);
        state = 'rejected';
      });
    }
    file.$destroy = function (file) {
      state = 'pending';
      var fd = new FormData();
      fd.append('type', file.type);
      angular.forEach(file.result.attachments, function(key, value) {
        var destroy = {_destroy: 1};
        fd.append('attachments_attributes[]', destroy);
      });
      Assets.delete({siteId: file.siteId, assetId: file.result.id}, fd, function(data) {
        console.log(data);
        state = 'resolved';
      }, function(error) {
        console.log(error);
        state = 'rejected';
      });
    };
  } else if (!file.$cancel && !file._index) {
    file.$cancel = function () {
      $scope.clear(file);
    };
  }

  var docTypes = [
    {title:'Billing Reference Document',id:'1'},
    {title:'Completion Payment Check',id:'2'},
    {title:'Customer Invoice',id:'3'},
    {title:'Deductive Check',id:'4'},
    {title:'EagleView',id:'5'},
    {title:'HOA Approval Document',id:'6'},
    {title:'Initial Payment Check',id:'7'},
    {title:'Insurance scope document',id:'8'},
    {title:'Material List',id:'9'},
    {title:'Supplement Documentation',id:'10'},
    {title:'Trade work Bid',id:'11'},
    {title:'Xactmate',id:'12'},
    {title:'Other',id:'13'}
  ]
  function findDocType(docType) {
    var id = 0;
    angular.forEach(docTypes, function(value, key) {
      if (value.title === docType) {
        id = value.id;
      }
    });
    return id;
  }

  var stages = [
    {title:'Lead',id:'1'},
    {title:'Contract',id:'2'},
    {title:'Project',id:'3'},
    {title:'Production',id:'4'},
    {title:'Billing',id:'5'}
  ]
  function findStage(stage) {
    var id = 0;
    angular.forEach(stages, function(value, key) {
      if (value.title === stage) {
        id = value.id;
      }
    });
    return id;
  }
}]);


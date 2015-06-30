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
    controller: function ($rootScope, $scope, $element, fileUpload, Images, Documents, Assets, ENV) {
      $scope.$on('fileuploadsend', function (e, data) {
        console.log($rootScope);
        var fd = new FormData();
        
        angular.forEach(data.files, function(value, key) {
          fd.append('attachments_attributes[file]', value);
        });
        fd.append('title', 'test');
        fd.append('type', 'Image');
        fd.append('stage', 1);
        fd.append('site_id', projectId);

        data.contentType = 'undefined';
        data.data = fd;
        data.headers = {"X-Auth-Token": "FzaP5pH6zCa5WSsgpAzi"}
        console.log(data);
        // Assets.save({siteId:projectId},fd, function(data) {
        //   console.log(data)
        // }, function(error) {
        //   console.log(error)
        // })
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

      var projectId = $scope.$parent.project.id;
      var url = ENV.apiEndpoint + '/api/v1/sites/' + projectId + '/assets';

      $scope.options = {
        url: url,
        dropZone: $element,
        maxFileSize: $scope.sizeLimit,
        autoUpload: false
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
        console.log(data);
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
            deleteType: 'POST',
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

      fileUpload.registerField($scope.stage);
      $scope.filequeue = fileUpload.fieldData[$scope.stage];

      fileUpload.registerField($scope.notes);
      $scope.filequeue = fileUpload.fieldData[$scope.notes];

      fileUpload.registerField($scope.doc_type);
      $scope.filequeue = fileUpload.fieldData[$scope.doc_type];

      fileUpload.registerField($scope.type);
      $scope.filequeue = fileUpload.fieldData[$scope.type];

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
      console.log('lets edit :)');
      console.log(file);
      var fd = {};
      fd.id = file.result.id;
      fd.title = file.title;

      return Assets.put({siteId: file.siteId}, fd, function(data) {
        console.log(data)
      }, function(error) {
        console.log(error);
      });
    }
    file.$destroy = function () {
      state = 'pending';
      return $http({
        url: file.deleteUrl,
        method: file.deleteType,
        headers: {
          "X-Auth-Token": "FzaP5pH6zCa5WSsgpAzi"
        },
        data: {
          "attachments_attributes[_destroy]": true,
        }
      }).then(
        function () {
          state = 'resolved';
          fileUpload.removeFieldData($scope.fieldname, file.result._id);
          $scope.clear(file);
        },
        function () {
          state = 'rejected';
          fileUpload.removeFieldData($scope.fieldname, file.result._id);
          $scope.clear(file);
        }
      );


    };
  } else if (!file.$cancel && !file._index) {
    file.$cancel = function () {
      $scope.clear(file);
    };
  }
}
]);


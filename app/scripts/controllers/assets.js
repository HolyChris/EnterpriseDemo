'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AssetsCtrl', function($scope, $location, $http, ENV, Flash, Overview, Contract,Customer,Sites,usSpinnerService,Managers,Documents,Images) {

})

.directive('ngUploadForm', ['$rootScope', 'fileUpload', function () {
  return {
    restrict: 'E',
    templateUrl: './templates/fileform.html',
    scope: {
      allowed: '@',
      url: '@',
      autoUpload: '@',
      sizeLimit: '@',
      ngModel: '=',
      name: '@'
    },
    controller: function ($rootScope, $scope, $element, fileUpload, Images, Documents) {
      $scope.$on('fileuploaddone', function (e, data) {
        fileUpload.addFieldData($scope.name, data._response.result.files[0].result);
      });

      $scope.options = {
        url: $scope.url,
        dropZone: $element,
        maxFileSize: $scope.sizeLimit,
        autoUpload: $scope.autoUpload
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

      function findDocType(docType) {
        angular.forEach($scope.docTypes, function(value, key) {
          console.log(docType + ' ' + value)
          if (docType === value.title) {
            console.log('match');
            return value.title;
          }
        });
      }

      $scope.documents = Documents.query({siteId: $scope.$parent.project.id}, function(data) {
        console.log(data);
        prepareFileObject(data.documents);
      }, function(error) {
        console.log(error);
      });
      $scope.images = Images.query({siteId: $scope.$parent.project.id}, function(data) {
        console.log(data);
        prepareFileObject(data.images);
      }, function(error) {
        console.log(error);
      });

      if (!$scope.queue) {
        $scope.queue = [];
      }

      var generateFileObject = function generateFileObjects(objects) {
        angular.forEach(objects, function (value, key) {
          var fileObject = {
            name: value.filename,
            size: value.length,
            url: '/file/' + value._id,
            thumbnailUrl: '/file/' + value._id,
            deleteUrl: '/file/' + value._id,
            deleteType: 'DELETE',
            result: value
          };
          $scope.queue[key] = fileObject;
        });
      };

      var prepareFileObject = function prepareFileObjects(objects) {
        angular.forEach(objects, function (value, key) {
          console.log(value.doc_type);
          var docType = findDocType(value.doc_type);
          var fileObject = {
            name: value.title,
            size: value.length,
            url: value.attachments[0].url,
            thumbnailUrl: value.attachments[0].url,
            deleteUrl: value.attachments[0].url,
            deleteType: 'DELETE',
            doc_type: value.doc_type,
            notes: value.notes,
            stage: value.stage,
            result: value
          };
          $scope.queue.push(fileObject);
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
.controller('FileDestroyController', ['$rootScope', '$scope', '$http', 'fileUpload', function ($rootScope, $scope, $http, fileUpload) {
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
    file.$destroy = function () {
      state = 'pending';
      return $http({
        url: file.deleteUrl,
        method: file.deleteType
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


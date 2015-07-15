'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AssetsCtrl', function($scope, $location, $http) {

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
    controller: function ($rootScope, $stateParams, $scope, $element, $timeout, $auth, fileUpload, Images, Documents, Assets, Overview, ENV, Flash) {
      var authToken = $auth.getToken();
      $scope.uploading = false;
      $scope.loadingFiles = false;
      $scope.docTypes = Assets.docTypes;
      $scope.stages = Assets.stages;
      var currentStage = '';

      $scope.multipleUploads = function() {
        angular.forEach($scope.queue, function(value, key) {
          if (!value.url) {
            $scope.fileUpload(value, key);
          }
        });
      }

      $scope.fileUpload = function(file, index) {
        $scope.queue[index].state = 'pending';
        $scope.uploading = true;
        var type = $scope.isImage(file.type) ? 'Image' : 'Document';
        var title = $scope.queue[index].title;
        var stage = Assets.findStage($scope.queue[index].stage);
        var notes = $scope.queue[index].notes;
        var fd = new FormData();
        fd.append('type', type);
        fd.append('attachments_attributes[0][file]', file);
        if (title) fd.append('title', title);
        fd.append('stage', stage);
        if (notes) fd.append('notes', notes);
        if (type === 'Document') {
          var docType = Assets.findDocType($scope.queue[index].doc_type);
          fd.append('doc_type', docType);
        }

        Assets.resource.save({siteId: projectId}, fd, function(data) {
          var newFile = [data.asset];
          $scope.queue[index].state = 'resolved';
          $scope.uploading = false;
          if (data.errors) {
            Flash.create('danger', 'Something happened. Please try again.');
            $scope.queue.splice(index, 1);
          } else {
            generateFileObject(newFile, index);
            Flash.create('success', 'File/s uploaded!');
          }
        });
      }

      $('#fileupload').bind('fileuploadsubmit', function (e, data) {
        return false;
      });

      $(document).bind('dragover', function (e) {
        var dropZone = $(window),
            timeout = window.dropZoneTimeout;
        if (!timeout) {
          $('body').addClass('drag');
        } else {
          clearTimeout(timeout);
        }
        window.dropZoneTimeout = setTimeout(function () {
          window.dropZoneTimeout = null;
          $('body').removeClass('drag');
        }, 100);
      });

      $(document).bind('drop', function (e) { // clear filters when new files are dropped.
        $('body').removeClass('drag');
        $scope.clearFilters();
      });

      $('#fileupload').bind('fileuploadadd', function(e, data) {
        
        $timeout(function() { // wait a bit for file to be readied.
            angular.forEach($scope.queue, function(value, key) {
            if (!value.url) {
              $scope.queue[key].stage = currentStage;
            }
          });
          $scope.$apply();
        }, 250);
      });

      // filters for showing/hiding documents or images.
      $scope.show = 'All';
      $scope.showImages = function() {
        $scope.show = 'Image';
      }
      $scope.showDocuments = function() {
        $scope.show = 'Document';
      }
      $scope.showAll = function() {
        $scope.show = 'All';
      }

      $scope.filter = {};
      $scope.clearFilters = function() {
        $scope.show = 'All';
        $scope.filter = {};
        return false;
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
      var dropzone = angular.element(document);

      $scope.options = {
        url: url,
        dropZone: dropzone,
        maxFileSize: $scope.sizeLimit,
        autoUpload: false,
        headers: {
          "X-Auth-Token": authToken, 
          "Content-Type": 'undefined', 
        }
      };
      
      var currentSite = Overview.query({siteId: projectId}, function(data) {
        if (data.site.stage === 'Opportunity') {
          currentStage = 'Lead';
        } else if (data.site.stage === 'Under Contract') {
          currentStage = 'Contract';
        } else {
          currentStage = data.site.stage;
        }
      }, function(error){
        // error state
      });

      $scope.assets = Assets.resource.query({siteId: projectId}, function(data) {
        generateFileObject(data.assets);
      }, function(error) {
        // error state
      });

      if (!$scope.queue) {
        $scope.queue = [];
      }

      var generateFileObject = function generateFileObjects(objects, index) {
        angular.forEach(objects, function (value, key) {
          var fileObject = {
            title: value.title,
            file_name: value.attachments[0].file_name,
            url: value.attachments[0].url,
            thumbnailUrl: value.attachments[0].url,
            doc_type: value.doc_type,
            notes: value.notes,
            stage: value.stage,
            type: value.type,
            siteId: projectId,
            result: value
          };
          var arrayPos = index ? index : key;
          $scope.queue[arrayPos] = fileObject;
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
      var stage = Assets.findStage(file.stage);
      var name = file.title != null ? file.title : undefined;
      var notes = file.notes != null ? file.notes : undefined;
      var fd = new FormData();
      fd.append('title', name);
      fd.append('type', file.type);
      fd.append('notes', notes);
      fd.append('stage', stage);
      if (file.type === 'Document') {
        var docType = Assets.findDocType(file.doc_type);
        fd.append('doc_type', docType);
      }

      Assets.resource.update({siteId: file.siteId, assetId: file.result.id}, fd, function(data) {
        file.message = 'Updated!';
        state = 'resolved';
      }, function(error) {
        file.error = 'Please try again.';
        state = 'rejected';
      });
    }
    file.$destroy = function (file) {
      state = 'pending';
      var result = confirm('Are you sure you wish to delete the asset ' + file.file_name + '?');
      if (result) {
        Assets.resource.delete({siteId: file.siteId, assetId: file.result.id}, function(data) {
          state = 'resolved';
          $scope.clear(file);
        }, function(error) {
          file.error = 'Please try again.';
          state = 'rejected';
        });
      } else {
        state = 'resolved';
      }
    };
  } else if (!file.$cancel && !file._index) {
    file.$cancel = function () {
      $scope.clear(file);
    };
  }
}]);

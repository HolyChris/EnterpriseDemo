'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AssetsCtrl', function($scope, $http) {

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
    controller: function ($rootScope, $state, $stateParams, $scope, $http, $element, $timeout, $auth, fileUpload, Images, Documents, Assets, Overview, ENV, Flash, $q) {
      var authToken = $auth.getToken();
      $scope.uploading = false;
      $scope.loadingFiles = false;
      $scope.docTypes = Assets.docTypes;
      $scope.stages = Assets.stages;
      var currentStage = '';

      

      // ** BEGIN SECTION FOR DOWNLOAD ALL FILES **
      $scope.downloadStarted=false;

      function deferredAddZip(url, filename, zip) {

        var deferred=$q.defer();
        //NOTE: Here we'll trick the browser not to get the file from a previous cached result as that
        //might not have CORS headers causing this XHR get to fail.. eventhough we already GOT the image..
        //we append a unique different query param at the end to force the fetching
        url = url + new Date().getTime();

        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                deferred.reject(err);
            } else {
                zip.file(filename, data, {binary:true});
                $scope.files_compressed=$scope.files_compressed+1;
                deferred.resolve(data);
            }
         });
        return deferred.promise;
      }

      $scope.downloadImages = function() {
        
        var zip = new JSZip();
        var deferreds=[];

        var files=$scope.queue;
        $scope.files_to_compress=0;//Total files will be calculated after looping and queuing the downloads
        $scope.files_compressed=0;
        
        angular.forEach(files, function(value, key) {
          if (!value.$submit){
            //We only zip files that were already uploaded
            deferreds.push(deferredAddZip(value.url, value.file_name, zip));  
            $scope.files_to_compress=$scope.files_to_compress+1;
          }
        });

        if ($scope.files_to_compress==0){
          //This means the list was showing elements but none was uploaded
          Flash.create('danger', 'Zip file could not be generated, there are no uploaded files to be zipped. Please upload files first.');
        }
        else{
          $scope.downloadStarted=true;
          $q.all(deferreds).then(function(data){
            //All promises have been succesfully completed
            var blob = zip.generate({type:"blob"});


            var zipfilename='all-' + $scope.page + '.zip';

            if ($scope.site.po_number){
              //If po number is defined we'll use this to form the zip filename
              zipfilename='PO-' + $scope.site.po_number + '-' + zipfilename;
            }


            //using FileSaver.js
            saveAs(blob, zipfilename);
            
            $scope.downloadStarted=false;
          },
          function(error){
            //One or more promises have failed
            Flash.create('danger', 'Something happened. Could not generate the zip file. Please try again.');
            $scope.downloadStarted=false;
          });
        }
        
        

       }
 
      // ** END SECTION FOR DOWNLOAD ALL FILES **


      $scope.multipleUploads = function() {
        angular.forEach($scope.queue, function(value, key) {
          if (!value.url) {
            if (key === $scope.queue.length - 1) {
              $scope.fileUpload(value, key, true);
            } else {
              $scope.fileUpload(value, key, false);
            }
          }
        });
      }

      $scope.fileUpload = function(file, index, showMessage) {
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
        fd.append('stage', parseInt(stage));
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
            if (showMessage) {
              Flash.create('success', 'File(s) uploaded!');
            }
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
      });

      $('#fileupload').bind('fileuploadadd', function(e, data) {
        
        $timeout(function() { // wait a bit for file to be readied.
          angular.forEach($scope.queue, function(value, key) {
            if (!value.url) {
              $scope.queue[key].stage = currentStage;
            }
            if (($scope.show === 'Document' && $scope.isImage(value.type)) || ($scope.show === 'Image' && !$scope.isImage(value.type))) {
              $scope.clearFilters();
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
        currentStage = data.site.stage;
        $scope.site=data.site;
      }, function(error){
        // error state
      });

      // get page and server proper content
      var assetPage = $state.current.name;
      var photoQueue = [];
      var documentQueue = [];
      var assets = Assets.resource.query({siteId: projectId}, function(data) {
        angular.forEach(data.assets, function(value, key) {
          if (value.type === 'Image') {
            photoQueue.push(value);
          } else {
            documentQueue.push(value);
          }
        });

        if (assetPage === 'project.photos') {
          generateFileObject(photoQueue);
          $scope.page = 'photos';
        } else {
          generateFileObject(documentQueue);
          $scope.page = 'documents';
        }
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
            //TODO replace to thumbnail_url when working properly
            //thumbnailUrl: value.attachments[0].thumbnail_url,
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
.controller('FileDestroyController', ['$rootScope', '$scope', '$http', '$confirm', 'fileUpload', 'Assets', function ($rootScope, $scope, $http, $confirm, fileUpload, Assets) {
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
      var fd = new FormData();
      if (file.title != null) {
        fd.append('title', file.title);
      }
      if (file.notes != null) {
        fd.append('notes', file.notes);
      }
      fd.append('type', file.type);
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
      $confirm({text: 'Are you sure you wish to delete the asset ' + file.file_name + '?', title: 'Delete Asset'})
        .then(function() {
          state = 'pending';
          Assets.resource.delete({siteId: file.siteId, assetId: file.result.id}, function(data) {
            state = 'resolved';
            $scope.clear(file);
          }, function(error) {
            file.error = 'Please try again.';
            state = 'rejected';
          });
      });
    };
  } else if (!file.$cancel && !file._index) {
    file.$cancel = function () {
      $scope.clear(file);
    };
  }
}]);

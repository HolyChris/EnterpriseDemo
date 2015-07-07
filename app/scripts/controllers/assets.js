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
      $scope.state;

      $('#fileupload').bind('fileuploadsubmit', function (e, data) {
        $scope.state = 'pending';
        var fd = new FormData();
        fd.append('type', 'Image');
        fd.append('attachments_attributes[0][file]', data.files[0]);

        Assets.save({siteId: projectId}, fd, function(data) {
          var newFile = [];
          newFile.push(data.asset);
          console.log(data);
          $scope.state = 'resolved';
          generateFileObject(newFile);
        }, function(error) {
          $scope.state = 'rejected';
          console.log(error);
        });

        return false;
      });

      $scope.$on('fileuploaddone', function (e, data) {
        fileUpload.addFieldData($scope.name, data._response.result.files[0].result);
        console.log('hola');
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
        Assets.delete({siteId: file.siteId, assetId: file.result.id}, function(data) {
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

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define([
      'jquery',
      'angular',
      './jquery.fileupload-image',
      './jquery.fileupload-audio',
      './jquery.fileupload-video',
      './jquery.fileupload-validate'
    ], factory);
  } else {
    factory();
  }
}(function () {
  'use strict';

  angular.module('blueimp.fileupload', [])

    // The fileUpload service provides configuration options
    // for the fileUpload directive and default handlers for
    // File Upload events:
    .provider('fileUpload', function () {

      var scopeEvalAsync = function (expression) {
          var scope = angular.element(this)
            .fileupload('option', 'scope');
          // Schedule a new $digest cycle if not already inside of one
          // and evaluate the given expression:
          scope.$evalAsync(expression);
        },
        addFileMethods = function (scope, data) {
          var files = data.files,
            file = files[0];
          angular.forEach(files, function (file, index) {
            file._index = index;
            file.$state = function () {
              return data.state();
            };
            file.$processing = function () {
              return data.processing();
            };
            file.$progress = function () {
              return data.progress();
            };
            file.$response = function () {
              return data.response();
            };
          });
          file.$submit = function () {
            if (!file.error) {
              return data.submit();
            }
          };
          file.$cancel = function () {
            return data.abort();
          };
        },
        $config;
      $config = this.defaults = {
        handleResponse: function (e, data) {
          var files = data.result && data.result.files;
          if (files) {
            data.scope.replace(data.files, files);
          } else if (data.errorThrown ||
            data.textStatus === 'error') {
            data.files[0].error = data.errorThrown ||
              data.textStatus;
          }
        },
        add: function (e, data) {
          if (e.isDefaultPrevented()) {
            return false;
          }
          var scope = data.scope,
            filesCopy = [];
          angular.forEach(data.files, function (file) {
            filesCopy.push(file);
          });
          scope.$apply(function () {
            addFileMethods(scope, data);
            var method = scope.option('prependFiles') ?
              'unshift' : 'push';
            Array.prototype[method].apply(scope.queue, data.files);
          });
          data.process(function () {
            return scope.process(data);
          }).always(function () {
            scope.$apply(function () {
              addFileMethods(scope, data);
              scope.replace(filesCopy, data.files);
            });
          }).then(function () {
            if ((scope.option('autoUpload') ||
              data.autoUpload) &&
              data.autoUpload !== false) {
              data.submit();
            }
          });
        },
        progress: function (e, data) {
          if (e.isDefaultPrevented()) {
            return false;
          }
          data.scope.$apply();
        },
        done: function (e, data) {
          if (e.isDefaultPrevented()) {
            return false;
          }
          var that = this;
          data.scope.$apply(function () {
            data.handleResponse.call(that, e, data);
          });
        },
        fail: function (e, data) {
          if (e.isDefaultPrevented()) {
            return false;
          }
          var that = this,
            scope = data.scope;
          if (data.errorThrown === 'abort') {
            scope.clear(data.files);
            return;
          }
          scope.$apply(function () {
            data.handleResponse.call(that, e, data);
          });
        },
        stop: scopeEvalAsync,
        processstart: scopeEvalAsync,
        processstop: scopeEvalAsync,
        getNumberOfFiles: function () {
          var scope = this.scope;
          return scope.queue.length - scope.processing();
        },
        dataType: 'json',
        autoUpload: false
      };

      /**
       * Create field data object
       * @type {{}}
       */
      var fieldData = {};

      /**
       * Add field Data to field data object with fieldname
       * @param fieldName
       * @param fileData
       */
      var addFieldData = function addFieldData(fieldName, fileData) {
        fieldData[fieldName].push(fileData);
      };

      /**
       * Remove field data
       * @param fieldName
       * @param fileId
       */
      var removeFieldData = function removeFieldData(fieldName, fileId) {
        angular.forEach(fieldData[fieldName], function (value, key) {
          if (value && value._id) {
            if (value._id === fileId) {
              fieldData[fieldName].splice(key, 1);
            }
          }
        });
      };

      /**
       * Register the field
       * @param fieldName
       * @param fieldData
       * @todo prefill with existing data
       */
      var registerField = function registerField(fieldName) {
        if (!fieldData[fieldName]) {
          fieldData[fieldName] = [];
        }
      };

      this.$get = [
        function () {
          return {
            fieldData: fieldData,
            defaults: $config,
            addFieldData: addFieldData,
            removeFieldData: removeFieldData,
            registerField: registerField
          };
        }
      ];
    })

    // Format byte numbers to readable presentations:
    .provider('formatFileSizeFilter', function () {
      var $config = {
        // Byte units following the IEC format
        // http://en.wikipedia.org/wiki/Kilobyte
        units: [
          {size: 1000000000, suffix: ' GB'},
          {size: 1000000, suffix: ' MB'},
          {size: 1000, suffix: ' KB'}
        ]
      };
      this.defaults = $config;
      this.$get = function () {
        return function (bytes) {
          if (!angular.isNumber(bytes)) {
            return '';
          }
          var unit = true,
            i = 0,
            prefix,
            suffix;
          while (unit) {
            unit = $config.units[i];
            prefix = unit.prefix || '';
            suffix = unit.suffix || '';
            if (i === $config.units.length - 1 || bytes >= unit.size) {
              return prefix + (bytes / unit.size).toFixed(2) + suffix;
            }
            i += 1;
          }
        };
      };
    })

    // The FileUploadController initializes the fileupload widget and
    // provides scope methods to control the File Upload functionality:
    .controller('FileUploadController', [
      '$scope', '$element', '$attrs', '$window', 'fileUpload',
      function ($scope, $element, $attrs, $window, fileUpload) {
        var uploadMethods = {
          progress: function () {
            return $element.fileupload('progress');
          },
          active: function () {
            return $element.fileupload('active');
          },
          option: function (option, data) {
            if (arguments.length === 1) {
              return $element.fileupload('option', option);
            }
            $element.fileupload('option', option, data);
          },
          add: function (data) {
            return $element.fileupload('add', data);
          },
          send: function (data) {
            return $element.fileupload('send', data);
          },
          process: function (data) {
            return $element.fileupload('process', data);
          },
          processing: function (data) {
            return $element.fileupload('processing', data);
          }
        };
        $scope.disabled = !$window.jQuery.support.fileInput;
        $scope.queue = $scope.queue || [];
        $scope.clear = function (files) {
          var queue = this.queue,
            i = queue.length,
            file = files,
            length = 1;
          if (angular.isArray(files)) {
            file = files[0];
            length = files.length;
          }
          while (i) {
            i -= 1;
            if (queue[i] === file) {
              return queue.splice(i, length);
            }
          }
        };
        $scope.replace = function (oldFiles, newFiles) {
          var queue = this.queue,
            file = oldFiles[0],
            i,
            j;
          for (i = 0; i < queue.length; i += 1) {
            if (queue[i] === file) {
              for (j = 0; j < newFiles.length; j += 1) {
                queue[i + j] = newFiles[j];
              }
              return;
            }
          }
        };
        $scope.applyOnQueue = function (method) {
          var list = this.queue.slice(0),
            i,
            file;
          for (i = 0; i < list.length; i += 1) {
            file = list[i];
            if (file[method]) {
              file[method]();
            }
          }
        };
        $scope.submit = function () {
          console.log(this);
          this.applyOnQueue('$submit');
        };
        $scope.cancel = function () {
          this.applyOnQueue('$cancel');
        };
        // Add upload methods to the scope:
        angular.extend($scope, uploadMethods);
        // The fileupload widget will initialize with
        // the options provided via "data-"-parameters,
        // as well as those given via options object:
        $element.fileupload(angular.extend(
            {scope: $scope},
            fileUpload.defaults
          )).on('fileuploadadd', function (e, data) {
            data.scope = $scope;
          }).on('fileuploadfail', function (e, data) {
            if (data.errorThrown === 'abort') {
              return;
            }
            if (data.dataType &&
              data.dataType.indexOf('json') === data.dataType.length - 4) {
              try {
                data.result = angular.fromJson(data.jqXHR.responseText);
              } catch (ignore) {
            }
          }
        }).on([
          'fileuploadadd',
          'fileuploadsubmit',
          'fileuploadsend',
          'fileuploaddone',
          'fileuploadfail',
          'fileuploadalways',
          'fileuploadprogress',
          'fileuploadprogressall',
          'fileuploadstart',
          'fileuploadstop',
          'fileuploadchange',
          'fileuploadpaste',
          'fileuploaddrop',
          'fileuploaddragover',
          'fileuploadchunksend',
          'fileuploadchunkdone',
          'fileuploadchunkfail',
          'fileuploadchunkalways',
          'fileuploadprocessstart',
          'fileuploadprocess',
          'fileuploadprocessdone',
          'fileuploadprocessfail',
          'fileuploadprocessalways',
          'fileuploadprocessstop'
        ].join(' '), function (e, data) {
          if ($scope.$emit(e.type, data).defaultPrevented) {
            e.preventDefault();
          }
        }).on('remove', function () {
          // Remove upload methods from the scope,
          // when the widget is removed:
          var method;
          for (method in uploadMethods) {
            if (uploadMethods.hasOwnProperty(method)) {
              delete $scope[method];
            }
          }
        });
        // Observe option changes:
        $scope.$watch(
          $attrs.fileUpload,
          function (newOptions) {
            if (newOptions) {
              $element.fileupload('option', newOptions);
            }
          }
        );
      }
    ])

    // Provide File Upload progress feedback:
    .controller('FileUploadProgressController', [
      '$scope', '$attrs', '$parse',
      function ($scope, $attrs, $parse) {
        var fn = $parse($attrs.fileUploadProgress),
          update = function () {
            var progress = fn($scope);

            if (!progress || !progress.total) {
              return;
            }
            $scope.num = Math.floor(
              progress.loaded / progress.total * 100
            );
          };
        update();
        $scope.$watch(
          $attrs.fileUploadProgress + '.loaded',
          function (newValue, oldValue) {
            if (newValue !== oldValue) {
              update();
            }
          }
        );
      }
    ])

    // Display File Upload previews:
    .controller('FileUploadPreviewController', [
      '$scope', '$element', '$attrs',
      function ($scope, $element, $attrs) {
        $scope.$watch(
          $attrs.fileUploadPreview + '.preview',
          function (preview) {
            $element.empty();
            if (preview) {
              $element.append(preview);
            }
          }
        );
      }
    ])

    .directive('fileUpload', function () {
      return {
        controller: 'FileUploadController',
        scope: true
      };
    })

    .directive('fileUploadProgress', function () {
      return {
        controller: 'FileUploadProgressController',
        scope: true
      };
    })

    .directive('fileUploadPreview', function () {
      return {
        controller: 'FileUploadPreviewController'
      };
    })

    // Enhance the HTML5 download attribute to
    // allow drag&drop of files to the desktop:
    .directive('download', function () {
      return function (scope, elm) {
        elm.on('dragstart', function (e) {
          try {
            e.originalEvent.dataTransfer.setData(
              'DownloadURL',
              [
                'application/octet-stream',
                elm.prop('download'),
                elm.prop('href')
              ].join(':')
            );
          } catch (ignore) {
          }
        });
      };
    });

}));

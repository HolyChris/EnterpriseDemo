'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('OverviewCtrl', function($scope, $location, $http, ENV, Flash, Overview, Contract) {
  $scope.config = {
    itemsPerPage: 10
  }
  var workTypeValues = {'Cash':'1','Insurance':'2','Maintenance':'3'};
  $scope.contract = {};
  $scope.work_types = {};
  $scope.newContract = true;

  $scope.uploadFile = function(files) {
    var fd = new FormData();
    fd.append("file", files[0]);
    $scope.contract.document = files[0];
    $scope.$apply();
  };

  $scope.saveContract = function() {
    
    var siteId = $scope.project.id;
    if ($scope.work_types) {
      var work_type_ids = new Array();
      var types = $scope.work_types;
      for (var key in types) {
        var value = key.replace('work_type_', '');
        work_type_ids.push(value);
      }
      $scope.contract.work_type_ids = work_type_ids;
    }
    $scope.contract.price = $scope.contract.price ? parseFloat($scope.contract.price.replace(/\$/g, '')) : undefined;

    console.log(JSON.stringify($scope.contract));
    console.log($scope.contract);

    if ($scope.newContract) {
      Contract.post({siteId:siteId},$scope.contract, function(data) {
          Flash.create('success', 'Contract successfully saved!');
        }, function(error) {
          $scope.contractErrors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
          console.log(error);
        });
    } else { 
      Contract.put({siteId:siteId},$scope.contract, function(data) {
          Flash.create('success', 'Contract successfully saved!');
        }, function(error) {
          $scope.contractErrors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
          console.log(error);
        });
    }
  }

  function prepareContractView(contract) {
    $scope.contract = contract;
    $scope.contract.signed_at = new Date(contract.signed_at);
    $scope.contract.contract_type = workTypeValues[contract.contract_type];

    for (var i = 0; i < contract.work_types.length; i++) {
      var workType = 'work_type_' + contract.work_types[i].id;
      $scope.work_types[workType] = true;
    }
  }
  
  //Here we find out if the url is passing a siteId
  if ($location.search().siteId) {
    Overview.query({siteId: $location.search().siteId}, function(overview) {
      $scope.project = overview.site;
      
      if ($scope.project.contract) {
        prepareContractView($scope.project.contract);
        $scope.newContract = false;
      } else {
        $scope.newContract = true;
      }
      
      $scope.project_title = $scope.project.customer.firstname + " " + $scope.project.customer.lastname;
      
      if ($scope.project.customer.bussinessname) {
        $scope.project_title = $scope.project.customer.bussinessname + ' - ' + $scope.project_title;
      }
    });
  }
  
  
  $scope.photoList = [
    {
      stage: 'contract',
      thumbnail: '/images/thumb1.png',
      title: 'john doe-roof 1',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb2.png",
      title: 'john doe-roof 2',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb2.png",
      title: 'john doe-roof 2',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb2.png",
      title: 'john doe-roof 2',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb2.png",
      title: 'john doe-roof 2',
    },
    {
      stage: "lead",
      thumbnail: "/images/thumb3.png",
      title: 'john doe-roof 3',
    }
  ]
  $scope.docList = [
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    },
    {
      doc_type: "material list",
      doc_name: "johndoe_materialist.docx"
    }
  ]
  });


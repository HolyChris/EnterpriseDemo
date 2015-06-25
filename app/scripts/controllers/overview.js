'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('OverviewCtrl', function($scope, $location, $http, ENV, Flash, Overview, Contract,Customer,Sites,usSpinnerService) {

  $scope.config = {
    itemsPerPage: 10
  }

  $scope.state_abb = ["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR",
                        "NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA",
                        "MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN",
                        "TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT",
                        "NY","SC","AK","WV","AA","AE","AP"];
  $scope.siteSource = ['Qualified Storm Leads','Commercial Call Leads','Self-Generated','Canvasser','Call in Leads','Mailer','Sign','Website','Friend','Neighbor','Truck Sign','Call/Knock','Other','Existing Customer' ];
  var workTypeValues = {'Cash':'1','Insurance':'2','Maintenance':'3'};
  $scope.contract = {};
  $scope.work_types = {};
  $scope.newContract = true;

  $scope.uploadFile = function(files) {
    $scope.contract.document = files[0];
    $scope.$apply();
  };

  $scope.openDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  }

  $scope.saveContract = function() {
    usSpinnerService.spin('spinner-1');
    
    var siteId = $scope.project.id;
    if ($scope.contract.price) {
      $scope.contract.price = parseFloat($scope.contract.price.replace(/\$/g, ''));
    }

    var fd = new FormData(); // prepare as form data to handle files.
    for (var key in $scope.contract) {
      fd.append(key, $scope.contract[key]);
    }

    if ($scope.work_types) {
      var work_type_ids = new Array();
      var types = $scope.work_types;
      for (var key in types) {
        var value = key.replace('work_type_', '');
        work_type_ids.push(value);
      }
      for (var i =0; i < work_type_ids.length; i++) {
        fd.append('work_type_ids[]', work_type_ids[i]);
      }
      $scope.contract.work_type_ids = work_type_ids;
    }

    if ($scope.newContract) {
      Contract.post({siteId:siteId},fd, function(data) {
        usSpinnerService.stop('spinner-1');
        Flash.create('success', 'Contract successfully saved!');
        $scope.contract.document_url = data.contract.document_url;
        $scope.contract.id = data.contract.id;
        $scope.contract.po_number = data.contract.po_number;
        $scope.contract.documentName = $scope.contract.document.name;
        $scope.newContract = false;
      }, function(error) {
        usSpinnerService.stop('spinner-1');
        $scope.contractErrors = error.data.errors;
        Flash.create('danger', 'Something happened. See errors below.');
        console.log(error);
      });
    } else { 
      Contract.put({siteId:siteId},$scope.contract, function(data) {
        usSpinnerService.stop('spinner-1');
        Flash.create('success', 'Contract successfully saved!');
      }, function(error) {
        usSpinnerService.stop('spinner-1');
        $scope.contractErrors = error.data.errors;
        Flash.create('danger', 'Something happened. See errors below.');
        console.log(error);
      });
    }
  }

  function prepareProjectSectionsToBeEdited(site)
  {
    prepareCustomerDetails(site.customer);
    prepareAddressDetails(site.address);
    prepareSiteDetails(site);
  }

  
  function prepareContractView(contract) {
    $scope.contract = contract;
    $scope.contract.signed_at = new Date(contract.signed_at);
    $scope.contract.contract_type = workTypeValues[contract.contract_type];
    var path = contract.document_url.substring(contract.document_url.lastIndexOf('/') + 1);
    var filename = path.substring(0, path.lastIndexOf('?'));
    $scope.contract.documentName = filename;

    for (var i = 0; i < contract.work_types.length; i++) {
      var workType = 'work_type_' + contract.work_types[i].id;
      $scope.work_types[workType] = true;
    }
  }
  
  //Here we find out if the url is passing a siteId
  if ($location.search().siteId) {
    Overview.query({siteId: $location.search().siteId}, function(overview) {
      $scope.project = overview.site;
      prepareProjectSectionsToBeEdited(overview.site);
      
      if ($scope.project.contract) {
        prepareContractView($scope.project.contract);
        $scope.newContract = false;
      } else {
        $scope.newContract = true;
      }
      
      
    });
  }

  function prepareCustomerDetails(customer)
  {
    //customer input param comes from API query or as a result of a put
    $scope.project.customer=customer;


    $scope.customer_title = $scope.project.customer.firstname + " " + $scope.project.customer.lastname;
    
    if ($scope.project.customer.bussinessname) {
      $scope.customer_title = $scope.project.customer.bussinessname + ' - ' + $scope.customer_title;
    }

    fillEditableCustomerInfoFromApiData();

  }

  function fillEditableCustomerInfoFromApiData()
  {
    //$scope.customer holds editable values
    //$scope.project.customer holds values from last API request
    $scope.customer=angular.copy($scope.project.customer);
    
    //we delete the phone_numbers element so that customer update does not include this object in request
    delete $scope.customer.phone_numbers;

    clearErrors();
  }

  $scope.customer_info_edition_enabled=false;
  $scope.enable_customer_info_edition = function (){
    $scope.customer_info_edition_enabled=true; 
  }

  $scope.cancel_customer_info_edition = function (){
    $scope.customer_info_edition_enabled=false;
    fillEditableCustomerInfoFromApiData();
  }

  $scope.save_customer_info_edition = function (){
    Customer.save({customerId: $scope.customer.id}, $scope.customer, function(data) {
          Flash.create('success', 'Customer details successfully saved!');
          prepareCustomerDetails(data.customer);
          $scope.customer_info_edition_enabled=false;
        }, function(error) {
          $scope.errors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        });

  }

  function clearErrors()
  {
    $scope.errors={};
    Flash.dismiss();
  }

  function prepareAddressDetails(address)
  {
    //customer input param comes from API query or as a result of a put
    $scope.project.address=address;

    fillEditableAddressInfoFromApiData();

  }

  function fillEditableAddressInfoFromApiData()
  {
    
    //$scope.address holds editable values
    //$scope.project.address holds values from last API request
    $scope.address=angular.copy($scope.project.address);
    clearErrors();
    
  }

  $scope.address_edition_enabled=false;
  $scope.enable_address_edition = function (){
    $scope.address_edition_enabled=true; 
  }

  $scope.cancel_address_edition = function (){
    $scope.address_edition_enabled=false;
    fillEditableAddressInfoFromApiData();
  }

  $scope.save_address_edition = function (){
    //This is the way API is expecting address values to be passed
    //object structure with address_attributes inner empty object is created
    var addressAttributesUpdate={
        address_attributes: {}
    };
    //then edited values are copied over to the object
    angular.copy($scope.address,addressAttributesUpdate.address_attributes);
    
    //State id has also to be provided in a different way 
    addressAttributesUpdate.address_attributes.state_id=$scope.address.state.id;

    //We invoke the sites update api with only address information to be updated
    Sites.save({siteId: $scope.project.id}, addressAttributesUpdate, function(data) {
          Flash.create('success', 'Address successfully saved!');
          prepareAddressDetails(data.site.address);
          $scope.address_edition_enabled=false;
        }, function(error) {
          $scope.errors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        });
  }


  function prepareSiteDetails(site)
  {
    //customer input param comes from API query or as a result of a put
    $scope.project=site;

    fillEditableSiteInfoFromApiData();

  }

  function fillEditableSiteInfoFromApiData()
  {
    //$scope.site holds editable values
    //$scope.project.customer holds values from last API request
    $scope.site=angular.copy($scope.project);
    
    //we delete all other inner object we want
    //to make sure is not sent to the update API
    delete $scope.site.customer;
    delete $scope.site.address;
    delete $scope.site.bill_address;
    delete $scope.site.appointments;
    delete $scope.site.assets;
    delete $scope.site.contract;


    clearErrors();
    
  }

  $scope.site_info_edition_enabled=false;
  $scope.enable_site_info_edition = function (){
    $scope.site_info_edition_enabled=true; 
  }

  $scope.cancel_site_info_edition = function (){
    $scope.site_info_edition_enabled=false;
    fillEditableSiteInfoFromApiData();
  }

  $scope.save_site_info_edition = function (){
    
    //The API to update source information recieves an integer BUT information
    //returned or queried from site.. returns the actual string
    //We invoke the sites update api with only address information to be updated
    Sites.save({siteId: $scope.project.id}, $scope.site, function(data) {
          Flash.create('success', 'Site information successfully saved!');
          prepareSiteDetails(data.site);
          $scope.site_info_edition_enabled=false;
        }, function(error) {
          $scope.errors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
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


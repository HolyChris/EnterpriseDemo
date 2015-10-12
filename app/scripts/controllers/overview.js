'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('OverviewCtrl', function($scope, $location, $state, $stateParams, ENV, Flash, Overview, Contract,Customer,Sites,usSpinnerService,Managers,Address,Portal,User,Project) {

  $scope.config = {
    itemsPerPage: 10
  }

  $scope.states_array = Address.States;
  
  $scope.siteSource = ['Qualified Storm Leads','Commercial Call Leads','Self-Generated','Canvasser','Call in Leads','Mailer','Sign','Website','Friend','Neighbor','Truck Sign','Call/Knock','Other','Existing Customer' ];

  $scope.phoneTypes = [{
      value: 1,
      label: 'Business',
    }, {
      value: 2,
      label: 'Home',
    }, {
      value: 3,
      label: 'Mobile',
    }, {
      value: 0,
      label: 'Other',
    }];

  var workTypeValues = {'Cash':'1','Insurance':'2','Maintenance':'3'};
  $scope.contract = {};
  $scope.work_types = {};
  $scope.newContract = true;

  $scope.enableProjectDetails = false;

  var globalData = $scope.$parent.globalData;
  globalData.$promise.then(function() {
    $scope.enableProjectDetails = $scope.$parent.enableProjectDetails;
  });

  $scope.uploadFile = function(files) {
    $scope.contract.document = files[0];
    $scope.$apply();
  };

  $scope.openDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  }

  $scope.sendEmail = function() {
    usSpinnerService.spin('spinner-2');
    var siteId = $scope.project.id;
    Portal.query({siteId:siteId}, function(data) {
      if (data.errors) {
        Flash.create('danger', 'Something happened, please refresh and try again.');
      } else {
        Flash.create('success', data.message);
      }
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      usSpinnerService.stop('spinner-2');
    });
  }

  $scope.saveContract = function() {
    usSpinnerService.spin('spinner-1');

    if ($scope.contract.price) {
      $scope.contract.price = parseFloat($scope.contract.price);  
    } else {
      delete $scope.contract.price;
    }

    if ($scope.contract.notes === null) {
      delete $scope.contract.notes;
    }
    if ($scope.contract.special_instructions === null) {
      delete $scope.contract.special_instructions;
    }

    if ($scope.newContract && !$scope.contract.document || !$scope.contract.signed_at) {
      Flash.create('danger', 'Document and Signed on date are required');
      usSpinnerService.stop('spinner-1');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      return;
    }
    
    var siteId = $scope.project.id;

    var fd = new FormData(); // prepare as form data to handle files.
    for (var key in $scope.contract) {
      if (key !== 'work_types' && key !== 'work_type_ids') {
        fd.append(key, $scope.contract[key]);  
      }
    }

    if ($scope.work_types) {
      var work_type_ids = new Array();
      var types = $scope.work_types;
      for (var key in types) {
        if (types[key]) {
          var value = key.replace('work_type_', '');
          work_type_ids.push(value);
        }
      }
      if (work_type_ids.length) {
        for (var i = 0; i < work_type_ids.length; i++) {
          fd.append('work_type_ids[]', work_type_ids[i]);
        }
      } else {
        fd.append('work_type_ids[]', '');
      }
      
      $scope.contract.work_type_ids = work_type_ids;
    }

    if ($scope.newContract) {
      Contract.post({siteId:siteId},fd, function(data) {
        if (data.errors) {
          usSpinnerService.stop('spinner-1');
          $scope.contractErrors = data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        } else {
          usSpinnerService.stop('spinner-1');
          Flash.create('success', 'Contract successfully saved!');
          $scope.contract.document_url = data.contract.document_url;
          $scope.contract.id = data.contract.id;
          $scope.contract.po_number = data.contract.po_number;
          $scope.contract.documentName = $scope.contract.document.name;
          $scope.newContract = false;
          $scope.$parent.refreshNavStatus();
          $scope.enableProjectDetails = true;
          $scope.$parent.enableProjectDetails = true;
          $scope.$parent.enableProduction = true;
          $scope.$parent.enableBilling = true;
        }        
      });
    } else {
      Contract.put({siteId:siteId},fd, function(data) {
        if (data.errors) {
          usSpinnerService.stop('spinner-1');
          $scope.contractErrors = data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        } else {
          usSpinnerService.stop('spinner-1');
          $scope.contract.document_url = data.contract.document_url;
          if ($scope.contract.document) {
            $scope.contract.documentName = $scope.contract.document.name;  
          }
          Flash.create('success', 'Contract successfully saved!');
          $scope.$parent.refreshNavStatus();
        } 
      });
    }
  }

  $scope.removeDocument = function() {
    delete $scope.contract.document_url;
    delete $scope.contract.documentName;
  }

  function prepareProjectSectionsToBeEdited(site)
  {
    prepareCustomerDetails(site.customer);
    prepareAddressDetails(site.address);
    prepareBillAddressDetails(site.bill_address);
    prepareSiteDetails(site);
    preparePhoneNumbersDetails(site.customer.phone_numbers);
  }

  
  function prepareContractView(contract) {
    $scope.contract = contract;
    $scope.contract.signed_at = new Date(contract.signed_at);
    $scope.contract.contract_type = workTypeValues[contract.contract_type];
    if (contract.price) {
      var price = contract.price.replace('$', '').replace(/,/g, '');
      $scope.contract.price = parseFloat(price);
    }
    var path = contract.document_url.substring(contract.document_url.lastIndexOf('/') + 1);
    var filename = path.substring(0, path.lastIndexOf('?'));
    $scope.contract.documentName = filename;

    for (var i = 0; i < contract.work_types.length; i++) {
      var workType = 'work_type_' + contract.work_types[i].id;
      $scope.work_types[workType] = true;
    }
  }
  
  //Here we find out if the url is passing a siteId
  if ($stateParams.projectId){
    Overview.query({siteId: $stateParams.projectId}, function(overview) {
      $scope.project = overview.site;
      prepareProjectSectionsToBeEdited(overview.site);
      
      if ($scope.project.contract) {
        prepareContractView($scope.project.contract);
        $scope.newContract = false;

        // get Customer Portal Data
        Project.getProjectDetailFromSite($stateParams.projectId, function(data) {
          $scope.customerPortalUrl = $location.protocol() + '://' + $location.host() + '/#/customerportal?token=' + data.project.customer.page_token;
        });

      } else {
        $scope.newContract = true;
      }
      
    });
  }

  $scope.managersArray = Managers.query();
  $scope.addManager = function($item, $model, $label) {
    for (var i = 0; i < $scope.managersArray.users.length; i++) {
      if ($scope.managersArray.users[i].id === $item.id) {
        $scope.managersArray.users.splice(i, 1);
      }
    }
    $scope.site_edit.managers.push($item);
    $scope.site_edit.managersSelected = undefined; // clear input
    
  }
  $scope.removeManager = function(id) {
    for (var i = 0; i < $scope.site_edit.managers.length; i++) {
      if ($scope.site_edit.managers[i].id === id) {
        $scope.managersArray.users.push($scope.site_edit.managers[i]);
        $scope.site_edit.managers.splice(i, 1);
      }
    }
  }

  $scope.addPhone = function(evt) {
      // By just adding one value to model
      // we add one more phone item to the view 
      $scope.phone_numbers_edit.push({
        id: null, 
        number: "", 
        primary: false, 
        num_type: 1
      });
    };

  $scope.removePhone = function(item) {
    item["_destroy"] = 1;
  };
  

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
    if ($scope.customer_form.$valid)
    {
      Customer.save({customerId: $scope.customer.id}, $scope.customer, function(data) {
          //TODO 422 error ends up here in success function, for the moment we interpret an error when errors object is present
          if (!data.errors){
            Flash.create('success', 'Customer details successfully saved!');
            prepareCustomerDetails(data.customer);
            $scope.customer_info_edition_enabled=false;
            $scope.$parent.refreshNavStatus();
          }
          else{
            $scope.errors = data.errors;
            Flash.create('danger', 'Something happened. See errors below.');
          }

            
          }, function(error) {
            $scope.errors = error.data.errors;
            Flash.create('danger', 'Something happened. See errors below.');
          });
    }
    else{
      Flash.create('danger', 'Customer information changes were not submitted. Check errors below.');
    }


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

  function prepareBillAddressDetails(bill_address)
  {
    //customer input param comes from API query or as a result of a put
    $scope.project.bill_address=bill_address;
    fillEditableBillAddressInfoFromApiData();
  }

  function fillEditableAddressInfoFromApiData()
  {
    
    //$scope.address holds editable values
    //$scope.project.address holds values from last API request
    $scope.address=angular.copy($scope.project.address);
    $scope.bill_address=angular.copy($scope.project.bill_address);
    clearErrors();
    
  }

  function fillEditableBillAddressInfoFromApiData()
  {
    //$scope.bill_address holds editable values
    //$scope.project.bill_address holds values from last API request
    $scope.bill_address=angular.copy($scope.project.bill_address);
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
    if ($scope.address_form.$valid){

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

            if (!data.errors){

              Flash.create('success', 'Address successfully saved!');
              prepareAddressDetails(data.site.address);
              $scope.address_edition_enabled=false;
              $scope.$parent.refreshNavStatus();

            }
            else{
              $scope.errors = data.errors;
              Flash.create('danger', 'Something happened. See errors below.');
            }
          }, function(error) {
            $scope.errors = error.data.errors;
            Flash.create('danger', 'Something happened. See errors below.');
          });
    }
    else
    {
      Flash.create('danger', 'Address information changes were not submitted. Check errors below.');
    }
  }


  $scope.bill_address_edition_enabled=false;
  $scope.enable_bill_address_edition = function (){
    $scope.bill_address_edition_enabled=true; 
  }

  $scope.cancel_bill_address_edition = function (){
    $scope.bill_address_edition_enabled=false;
    fillEditableBillAddressInfoFromApiData();
  }

  $scope.save_bill_address_edition = function (){
    if ($scope.bill_address_form.$valid){

      //This is the way API is expecting address values to be passed
      //object structure with address_attributes inner empty object is created
      var addressAttributesUpdate={
          bill_address_attributes: {}
      };
      //then edited values are copied over to the object
      angular.copy($scope.bill_address,addressAttributesUpdate.bill_address_attributes);
      
      //State id has also to be provided in a different way 
      addressAttributesUpdate.bill_address_attributes.state_id=$scope.bill_address.state.id;

      //We invoke the sites update api with only address information to be updated
      Sites.save({siteId: $scope.project.id}, addressAttributesUpdate, function(data) {

            if (!data.errors){

              Flash.create('success', 'Bill Address successfully saved!');
              prepareBillAddressDetails(data.site.bill_address);
              $scope.bill_address_edition_enabled=false;
              $scope.$parent.refreshNavStatus();

            }
            else{
              $scope.errors = data.errors;
              Flash.create('danger', 'Something happened. See errors below.');
            }
          }, function(error) {
            $scope.errors = error.data.errors;
            Flash.create('danger', 'Something happened. See errors below.');
          });
    }
    else
    {
      Flash.create('danger', 'Bill Address information changes were not submitted. Check errors below.');
    }
  }


  function prepareSiteDetails(site)
  {
    //customer input param comes from API query or as a result of a put
    $scope.project=site;

    fillEditableSiteInfoFromApiData();

  }

  function fillEditableSiteInfoFromApiData()
  {
    //$scope.site_edit holds editable values
    //$scope.project.customer holds values from last API request
    $scope.site_edit=angular.copy($scope.project);
    
    //we delete all other inner object we want
    //to make sure is not sent to the update API
    delete $scope.site_edit.customer;
    delete $scope.site_edit.address;
    delete $scope.site_edit.bill_address;
    delete $scope.site_edit.appointments;
    delete $scope.site_edit.assets;
    delete $scope.site_edit.contract;

    //TODO WARNING, API returns source as string but expects Id as input for update 
    if ($scope.site_edit.source)
    {
      //TODO We need to move siteSource array somewhere.. relying on this lookup here is a very bad idea
      
      //We will set in $scope.site_edit.source the id that API for update is expecting
      //On source_description we'll store the actual text
      $scope.site_edit.source_description = $scope.site_edit.source
      $scope.site_edit.source = $scope.siteSource.indexOf($scope.site_edit.source)+1;

    }

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
    if ($scope.site_form.$valid){


      //The API to update source information recieves an integer BUT information
      //returned or queried from site.. returns the actual string
      //We invoke the sites update api with only address information to be updated

      //Manager array should be provided as manager_ids[11,221] 
      //where 11 and 221 are the ids of the Users, complete list should be provided every time
      
      var manager_ids=[];
      angular.forEach($scope.site_edit.managers, function(value, key) {
          manager_ids.push(value.id);
      });

      $scope.site_edit.manager_ids=manager_ids;

      Sites.save({siteId: $scope.project.id}, $scope.site_edit, function(data) {
            if (!data.errors){

              Flash.create('success', 'Site information successfully saved!');
              prepareSiteDetails(data.site);
              $scope.site_info_edition_enabled=false;
              $scope.$parent.refreshNavStatus();
            }
            else
            {
              $scope.errors = data.errors;
              Flash.create('danger', 'Something happened. See errors below.');
            }
          }, function(error) {
            $scope.errors = error.data.errors;
            Flash.create('danger', 'Something happened. See errors below.');
          });
    }
    else{
      Flash.create('danger', 'Site information changes were not submitted. Check errors below.');
    }
  }
  
  function preparePhoneNumbersDetails(phone_numbers)
  {
    //customer input param comes from API query or as a result of a put
    $scope.project.customer.phone_numbers=phone_numbers;

    fillEditablePhoneNumbersInfoFromApiData();

  }

  function fillEditablePhoneNumbersInfoFromApiData()
  {
    //$scope.phone_numbers_edit holds editable values
    //$scope.project.customer.phone_numbers holds values from last API request
    $scope.phone_numbers_edit=angular.copy($scope.project.customer.phone_numbers);
    
    clearErrors();
  }

  $scope.phone_numbers_info_edition_enabled=false;
  $scope.enable_phone_numbers_info_edition = function (){
    $scope.phone_numbers_info_edition_enabled=true; 
  }

  $scope.cancel_phone_numbers_info_edition = function (){
    $scope.phone_numbers_info_edition_enabled=false;
    fillEditablePhoneNumbersInfoFromApiData();
  }

  $scope.save_phone_numbers_info_edition = function (){
    //WE have to check that all phone_numbers forms are valid
    if ($scope.phone_numbers_form.$valid){



      var phone_numbers_attributes_update ={
          phone_numbers_attributes: {}
      };
      phone_numbers_attributes_update.phone_numbers_attributes=$scope.phone_numbers_edit;
      phone_numbers_attributes_update.id=$scope.customer.id;

      Customer.save({customerId: $scope.customer.id}, phone_numbers_attributes_update, function(data) {

            if (!data.errors){
              Flash.create('success', 'Customer phone numbers successfully saved!');
              preparePhoneNumbersDetails(data.customer.phone_numbers);
              $scope.phone_numbers_info_edition_enabled=false;
              $scope.$parent.refreshNavStatus();
            }
            else{
              $scope.errors = data.errors;
              Flash.create('danger', 'Something happened. See errors below.');
            }
          }, function(error) {
            $scope.errors = error.data.errors;
            Flash.create('danger', 'Something happened. See errors below.');
          });
    }
    else{
      Flash.create('danger', 'Phone numbers information changes were not submitted. Check errors below.');
    }

  };

  // Required to do hasbang to an element id
  $scope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };

  //We check if current logged in user is admin
  $scope.userIsAdmin=User.getCurrentUserDetails().then(
    function(user){
      $scope.userIsAdmin=user.isAdmin;
    },
    function(error){
      Flash.create('danger', 'User access rights could not be queried. Something happened.');
      $scope.errors=error;
    }
    );

  $scope.deleteSite = function(siteId){
    Sites.delete({siteId: siteId}, $scope.site_edit, function(data){
      if (data.errors){
        //Request
        Flash.create('danger', 'Site could not be deleted. Something happened.');
      }
      else{
        //Request was succesful we have to redirect user to dashboard
        Flash.create('success', 'Site was successfully deleted!');
        $state.go('main');
      }

    }, function(error){
      Flash.create('danger', 'Site could not be deleted. Something happened.');
    });

  };

});


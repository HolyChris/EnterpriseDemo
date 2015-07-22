angular.module('ersApp')
  .controller('NewSiteCtrl', function ($scope,$state,$location,$http,Customer,Flash,$modal,Managers,Address,Sites) {
  $scope.customer_from_previous_page_flag = false;
  $scope.newSiteObject = {};
  $scope.submitted = false;

  $scope.lookupLinkedCustomerInfo = function(customer_id){
    Customer.query({id: customer_id},
      function(data) {
        $scope.customer = data.customer;
      }
    );
  };

  //Here we find out if the url is passing a customerId
  if ($location.search().customerId) {
    $scope.customer_from_previous_page_flag = true;
    $scope.lookupLinkedCustomerInfo($location.search().customerId);
  }
  
  $scope.show_search_customer_dialog = function() {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'views/customerSeachModal.html',
      controller: 'CustomerSearchModalInstanceCtrl',
      size: 'lg',
      resolve: {
        
      }
    });

    modalInstance.result.then(function (customer) {
      $scope.customer = customer;
    }, function() {
      
    });
  };

  $scope.flag = 0;
  $scope.siteAddress = {};
  $scope.billAddress = {};
  $scope.siteDetail = {};

  $scope.$watch('billingIsSameAsSite', function(value) {
   if(value) {
    $scope.flag = 1;
    $scope.newSiteObject.bill_address_attributes = $scope.newSiteObject.address_attributes;
   } else {
    $scope.flag = 0;
   }
  });

  $scope.states_array = Address.States;
  $scope.siteSource = ['Qualified Storm Leads','Commercial Call Leads','Self-Generated','Canvasser','Call in Leads','Mailer','Sign','Website','Friend','Neighbor','Truck Sign','Call/Knock','Other','Existing Customer' ];

  $scope.newSite = function() {
    $scope.submitted = true;
    $scope.errors = {};

    if (!$scope.customer || !$scope.customer.id || $scope.newsite.$error.$invalid === true) {
      Flash.create('danger', 'Something happened. Please correct errors below.');
      $scope.errors.customer = true;
      return;
    } else {
      $scope.newSiteObject.customer_id = $scope.customer.id;
    }

    if (manage_ids.length) {
      $scope.newSiteObject.manager_ids = manage_ids;
    }

    $scope.newSiteObject.bill_addr_same_as_addr = $scope.flag;
    Sites.post($scope.newSiteObject, function(data) {
      if (data.errors) {
        $scope.errors = data.errors;
        Flash.create('danger', 'Something happened. Please correct errors below or try again.');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        return;
      }
      Flash.create('success', 'Site created succesfully');
      $scope.submitted = false;
      $state.go("project.overview",{projectId: data.site.id});
    });
  };

  $scope.managersArray = Managers.query();
  $scope.managers = [];
  var manage_ids = [];

  $scope.addManager = function($item, $model, $label) {
    for (var i = 0; i < $scope.managersArray.users.length; i++) {
      if ($scope.managersArray.users[i].id === $item.id) {
        $scope.managersArray.users.splice(i, 1);
      }
    }
    $scope.managers.push($item);
    manage_ids.push($item.id);
    $scope.managersSelected = undefined; // clear input
  }

  $scope.removeManager = function(id) {
    manage_ids.splice(manage_ids.indexOf('&manager_ids[]='+id), 1);
    for (var i = 0; i < $scope.managers.length; i++) {
      if ($scope.managers[i].id === id) {
        $scope.managersArray.users.push($scope.managers[i]);
        $scope.managers.splice(i, 1);
      }
    }
  }

  function validateForm() {

  }
  
});

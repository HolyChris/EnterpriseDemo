angular.module('ersApp')
  .controller('NewSiteCtrl', function ($scope,$state,$location,$http,Customer,Flash,$modal,Managers,Address,Sites) {
  $scope.customer_from_previous_page_flag = false;

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
      $scope.billAddress = $scope.siteAddress;
   } else {
    $scope.flag = 0;
      $scope.billAddress = angular.copy($scope.billAddress);
   }
  });

  $scope.states_array = Address.States;
  
  $scope.siteSource = ['Qualified Storm Leads','Commercial Call Leads','Self-Generated','Canvasser','Call in Leads','Mailer','Sign','Website','Friend','Neighbor','Truck Sign','Call/Knock','Other','Existing Customer' ];

  $scope.newSite = function(siteAddress, siteDetail, billAddress) {
    $scope.errors = {};

    if (!$scope.customer || !$scope.customer.id) {
      Flash.create('danger', 'You must link the site to a customer before saving');
      $scope.errors.customer = true;
      return;
    }

    var manageIds = [];
    if (manage_ids.length) { 
      angular.forEach(manage_ids, function(value, key) {
        manageIds.push(value);
      });
    }

    var formData = {
      customer_id: $scope.customer.id,
      name: siteDetail.name,
      manage_ids: manageIds,
      contact_name: siteDetail.contact_name,
      contact_phone: siteDetail.contact_phone,
      source: siteDetail.source,
      source_info: siteDetail.source_info,
      status: siteDetail.status,
      damage: siteDetail.damage,
      address_attributes: {
        address1: siteAddress.address1,
        address2: siteAddress.address2,
        city: siteAddress.city,
        state_id: siteAddress.state_id,
        zipcode: siteAddress.zipcode,
      },
      bill_addr_same_as_addr: $scope.flag,
      bill_address_attributes: {
        address1: billAddress.address1,
        address2: billAddress.address2,
        city: billAddress.city,
        state_id: billAddress.state_id,
        zipcode: billAddress.zipcode
      }
    }

    Sites.post(formData, function(data) {
      if (data.errors) {
        $scope.errors = data.errors;
        Flash.create('danger', 'Something happened. Please correct errors below.');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        return;
      }
      Flash.create('success', 'Site created succesfully');
      $state.go("project.overview",{projectId: data.site.id})
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
    manage_ids.push('&manager_ids[]='+$item.id);
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
  
});

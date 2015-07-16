angular.module('ersApp')
  .controller('NewSiteCtrl', function ($scope,$state,$location,$http,Customer,ENV,Flash,$modal,Managers,Address) {
  $scope.customer_from_previous_page_flag=false;

  $scope.lookupLinkedCustomerInfo=function(customer_id){
    Customer.query({id: customer_id},
      function(data) {
        $scope.customer = data.customer;
      }
    );
  };

  //Here we find out if the url is passing a customerId
  if ($location.search().customerId)
  {
    $scope.customer_from_previous_page_flag=true;
    $scope.lookupLinkedCustomerInfo($location.search().customerId);
  }
  
  $scope.show_search_customer_dialog=function (){
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
    }, function () {
      
    });
  };

  $scope.flag=0;
  $scope.siteAddress={};
  $scope.billAddress={};
  $scope.siteDetail={};
  $scope.$watch('billingIsSameAsSite', function(value) {
   if(value) {
    $scope.flag =1;
      $scope.billAddress = $scope.siteAddress;
   } else {
    $scope.flag=0;
      $scope.billAddress = angular.copy($scope.billAddress);
   }
  });

  $scope.states_array=Address.States;
  
  $scope.siteSource = ['Qualified Storm Leads','Commercial Call Leads','Self-Generated','Canvasser','Call in Leads','Mailer','Sign','Website','Friend','Neighbor','Truck Sign','Call/Knock','Other','Existing Customer' ];

  $scope.newSite = function(siteAddress,siteDetail,billAddress) {
    var manageIds = manage_ids.length ? manage_ids.join('') : '';
    // re-factor this to use service.
    $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/api/v1/sites?customer_id=' + $scope.customer.id + '&name='+siteDetail.name + manageIds + '&contact_name='+siteDetail.contact_name+'&contact_phone='+siteDetail.contact_phone+'&manage_ids[]=1&manage_ids[]=2&source='+siteDetail.source+'&source_info='+siteDetail.source_info+'&status='+siteDetail.status+'&damage='+siteDetail.damage+'&address_attributes[address1]='+siteAddress.address1+'&address_attributes[address2]='+siteAddress.address2+'&address_attributes[city]='+siteAddress.address2+'&address_attributes[state_id]='+siteAddress.state_id+'&address_attributes[zipcode]='+siteAddress.zipcode+'&bill_addr_same_as_addr='+$scope.flag+'&bill_address_attributes[address1]='+billAddress.address1+'&bill_address_attributes[address2]='+billAddress.address2+'&bill_address_attributes[city]='+billAddress.city+'&bill_address_attributes[state_id]='+billAddress.state_id+'&bill_address_attributes[zipcode]='+billAddress.zipcode,
        headers: {
          'Content-type': 'application/json'
        }
     }).success(function(data){
       Flash.create('success', 'Site created succesfully');

        $state.go("project.overview",{projectId: data.site.id})
        
    }).error(function(data){
       $scope.errors=data.errors;
       Flash.create('danger', 'Site was not created');
       console.log(data.errors);
    })
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

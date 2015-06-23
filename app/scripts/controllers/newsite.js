angular.module('ersApp')

.run(function($http) {
  $http.defaults.headers.common= { 'X-Auth-Token' : 'D2EdWKgbs8cq9PHyLhrA' };
})
  .controller('NewSiteCtrl', function ($scope,$location,$http,ENV,Flash,$modal) {
    
  //Here we find out if the url is passing a customerId
  if ($location.search().customerId)
  {
    $scope.customer_id=$location.search().customerId;
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
      $scope.customer_id = customer.id;
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
  $scope.state_abb = ["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR",
                        "NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA",
                        "MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN",
                        "TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT",
                        "NY","SC","AK","WV","AA","AE","AP"];
  $scope.siteSource = ['Qualified Storm Leads','Commercial Call Leads','Self-Generated','Canvasser','Call in Leads','Mailer','Sign','Website','Friend','Neighbor','Truck Sign','Call/Knock','Other','Existing Customer' ];

  $scope.newSite = function(siteAddress,siteDetail,billAddress){
    $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/api/v1/sites?customer_id=' + $scope.customer_id + '&name='+siteDetail.name +'&contact_name='+siteDetail.contact_name+'&contact_phone='+siteDetail.contact_phone+'&manage_ids[]=1&manage_ids[]=2&source='+siteDetail.source+'&source_info='+siteDetail.source_info+'&status='+siteDetail.status+'&damage='+siteDetail.damage+'&address_attributes[address1]='+siteAddress.address1+'&address_attributes[address2]='+siteAddress.address2+'&address_attributes[city]='+siteAddress.address2+'&address_attributes[state_id]='+siteAddress.state_id+'&address_attributes[zipcode]='+siteAddress.zipcode+'&bill_addr_same_as_addr='+$scope.flag+'&bill_address_attributes[address1]='+billAddress.address1+'&bill_address_attributes[address2]='+billAddress.address2+'&bill_address_attributes[city]='+billAddress.city+'&bill_address_attributes[state_id]='+billAddress.state_id+'&bill_address_attributes[zipcode]='+billAddress.zipcode,
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
       Flash.create('success', 'Site created succesfully');
       $location.path("/sites")
       
       var url_params= {
            siteId: data.site.id
        };
        $location.path("/overview/project").search(url_params);
        
    }).error(function(data){
       $scope.errors=data.errors;
       Flash.create('danger', 'Site was not created');
    })
  };
  });

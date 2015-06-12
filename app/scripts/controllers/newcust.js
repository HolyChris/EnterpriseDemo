angular.module('ersApp')
  .controller('NewCustomerCtrl', function ($scope,$http, $location,ENV,Flash) {
$scope.user={}
  $scope.phone_number={}
  $scope.newCustomer = function(user,phone_number){
    $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/api/v1/customers?phone_numbers_attributes[0][number]='+phone_number.number+'&phone_numbers_attributes[0][num_type]=1&phone_numbers_attributes[0][primary]=true',
        params: user,
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.customers= data;
        
        var message = 'You have succesfully created a customer. <a href="#" class="alert-link">Click here to create a site </a> for this customer.';
        Flash.create('success', message);
        
        $scope.Flash=Flash;
        $scope.custList = data.customers;
        $location.path("/customers/overview")
    }).error(function(data){
        $scope.errors= data.errors;
        Flash.create('danger', "Customer was not created see errors below");

    })
  }
  
  $scope.newCustomerThenSite = function(user,phone_number){
    $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/api/v1/customers?phone_numbers_attributes[0][number]='+phone_number.number+'&phone_numbers_attributes[0][num_type]=1&phone_numbers_attributes[0][primary]=true',
        params: user,
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.customers= data;
        
        var message = 'You have succesfully created a customer.';
        Flash.create('success', message);
        
        $scope.Flash=Flash;
        $scope.custList = data.customers;
        
        var url_params= {
            customerId: data.customer.id
        };
        $location.path("/sites/new").search(url_params);
    }).error(function(data){
        $scope.errors= data.errors;
        Flash.create('danger', "Customer was not created see errors below");

    })
  }

  
});

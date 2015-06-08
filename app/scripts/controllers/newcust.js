angular.module('ersApp')
  .controller('NewCustomerCtrl', function ($scope,$http, $location,Flash) {
$scope.user={}
  $scope.phone_number={}
  $scope.newCustomer = function(user,phone_number){
    $http({
        method: 'POST',
        url: 'http://54.68.73.69/api/v1/customers?phone_numbers_attributes[0][number]='+phone_number.number+'&phone_numbers_attributes[0][num_type]=1&phone_numbers_attributes[0][primary]=true',
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
		$scope.errors= data;
        alert("Error Adding a New Customer. Please Try Again");
    })
  }
  });

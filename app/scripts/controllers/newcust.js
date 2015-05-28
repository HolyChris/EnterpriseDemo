angular.module('ersApp')
  .controller('NewCustomerCtrl', function ($scope,$http) {
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
        $scope.custList = data.customers;
    }).error(function(){
        alert("Error Adding a New Customer. Please Try Again");
    })
  }
  });

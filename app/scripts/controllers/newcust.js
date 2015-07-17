angular.module('ersApp')
  .controller('NewCustomerCtrl', function ($scope,$http, $location,ENV,Flash) {
  
  $scope.user = {};
  $scope.phone_number = [];

  if ($scope.phone_number.length <= 0) { // if no phone numbers exist
    $scope.phone_number.push({
      'type': '',
      'number': '',
      'primary': true, // only 1 primary can exist
      'remove': false, // to remove from backend
      'newPhone': false // new phone added from front end
    });
  }
  
  $scope.addPhone = function() {
    var newItemNo = $scope.phone_number.length + 1;
    $scope.phone_number.push({
      'type': '',
      'number': '',
      'primary': false, // only 1 primary can exist
      'remove': false, // to remove from backend
      'newPhone': true // new phone added from front end
    });
  }

  $scope.removePhone = function(index) {
    $scope.phone_number.splice(index, 1);
  }

  function phonePrepare() {
    var urlFragment = '';
    for (var i = 0; i < $scope.phone_number.length; i++) {
      if ($scope.phone_number[i].number.length > 0) {
        urlFragment += 'phone_numbers_attributes[' + i + '][number]=' + $scope.phone_number[i].number + '&phone_numbers_attributes[' + i + '][num_type]=' + $scope.phone_number[i].type + '&phone_numbers_attributes[' + i + '][primary]=' + $scope.phone_number[i].primary + '&';
      }
    }
    return urlFragment;
  }

  $scope.newCustomer = function(user) {
    var phoneUrlFragment = phonePrepare();

    $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/api/v1/customers?' + phoneUrlFragment,
        params: user,
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.customers = data;
        console.log(data);
        
        var message = 'You have succesfully created a customer. <a href="#" class="alert-link">Click here to create a site </a> for this customer.';
        Flash.create('success', message);
        
        $scope.Flash=Flash;
        $scope.custList = data.customers;
        $location.path("/customers/overview")
    }).error(function(data){
        $scope.errors = data.errors;
        Flash.create('danger', "Customer was not created see errors below");
        console.log($scope.errors);
    })
  }
  
  $scope.newCustomerThenSite = function(user) {
    var phoneUrlFragment = phonePrepare();

    $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/api/v1/customers?' + phoneUrlFragment,
        params: user,
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.customers = data;
        console.log(data);
        
        var message = 'You have succesfully created a customer.';
        Flash.create('success', message);
        
        $scope.Flash=Flash;
        $scope.custList = data.customers;
        
        var url_params= {
            customerId: data.customer.id
        };
        $location.path("/sites/new").search(url_params);
    }).error(function(data){
        $scope.errors = data.errors;
        Flash.create('danger', "Customer was not created see errors below");
        console.log(data.errors);
    })
  }

  
});

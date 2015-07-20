angular.module('ersApp')
  .controller('NewCustomerCtrl', function ($scope,$http,$state,$location,ENV,Flash,Customer) {
  
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
    var phoneArray = [];
    for (var i = 0; i < $scope.phone_number.length; i++) {
      if ($scope.phone_number[i].number.length > 0) {
        var phoneObject = {
          number: $scope.phone_number[i].number,
          num_type: $scope.phone_number[i].type,
          primary: $scope.phone_number[i].primary,
        }
        phoneArray.push(phoneObject);
      }
    }
    return phoneArray;
  }

  $scope.newCustomer = function(user) {
    user.phone_numbers_attributes = phonePrepare();

    Customer.post(user, function(data) {
      if (data.errors) {
        $scope.errors = data.errors;
        Flash.create('danger', "Customer was not created see errors below");
      } else {        
        Flash.create('success', 'You have succesfully created a customer.');    
        $state.go("customers");
      }
    });
  }
  
  $scope.newCustomerThenSite = function(user) { 
    user.phone_numbers_attributes = phonePrepare();
    
    Customer.post(user, function(data) {
      console.log(data);
      if (data.errors) {
        $scope.errors = data.errors;
        Flash.create('danger', "Customer was not created see errors below");
      } else {        
        Flash.create('success', 'You have succesfully created a customer.');
        $location.path("/sites/new").search({customerId: data.customer.id});
      }
    });
  }

  
});

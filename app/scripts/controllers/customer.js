angular.module('ersApp')
  .controller('CustomerCtrl', function($scope, $location, $state, $stateParams, Customer, Flash,User) {

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

    var customer = Customer.get({id: $stateParams.id}, function(data) {
      $scope.model = customer;
    });

    $scope.updateThenSite = function(id) {
      $scope.updateUser();
      $location.path("/sites/new").search({customerId: id});
    };

    $scope.updateUser = function(evt) {

      // Phone number format to be able to send and update view
      // BE spects this kind if attributes on update a customer
      // phone_numbers_attributes[0][ID]:232323232323
      // phone_numbers_attributes[0][number]:232323232323
      // phone_numbers_attributes[0][num_type]:2
      // phone_numbers_attributes[0][primary]:true

      angular.forEach($scope.model.customer.phone_numbers, function(value, key) {
        customer.customer['phone_numbers_attributes[' + key + '][id]'] = value.id;
        customer.customer['phone_numbers_attributes[' + key + '][number]'] = value.number;
        customer.customer['phone_numbers_attributes[' + key + '][num_type]'] = value.num_type;
        customer.customer['phone_numbers_attributes[' + key + '][primary]'] = value.primary;
        
        if (value._destroy) {
          customer.customer['phone_numbers_attributes[' + key + '][_destroy]'] = value._destroy;
        }
      });

      customer.$save($scope.model.customer, function (data) {
        Flash.create('success', 'Customer updated successfully!');
      }, function (error) {
        $scope.customerErrors = error.data.errors;
        Flash.create('danger', 'Something happened. See errors below.');
      });
    };

    $scope.addPhone = function(evt) {
      // By just adding one value to model
      // we add one more phone item to the view 
      $scope.model.customer.phone_numbers.push({
        id: null, 
        number: "", 
        primary: false, 
        num_type: 1
      });
    };

    $scope.removePhone = function(item) {
      item["_destroy"] = 1;
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

    $scope.deleteCustomer = function(customerId){
      Customer.delete({id: customerId}, {}, function(data){
        if (data.success===false){
          //Request
          Flash.create('danger', 'Customer could not be deleted.' + data.message);
        }
        else{
          //Request was succesful we have to redirect user to dashboard
          Flash.create('success', 'Customer was successfully deleted!');
          $state.go('customers');
        }

      }, function(error){
        var errorMessage;

        if (error.data.message){
          errorMessage=error.data.message;
        }
        else{
          errorMessage="Customer could not be deleted. Something happened.";
        }
        Flash.create('danger', errorMessage);
      });

    };



  });
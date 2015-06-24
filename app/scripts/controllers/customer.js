angular.module('ersApp')
  .controller('CustomerCtrl', function($scope, $stateParams, Customer, Flash) {

    var customer = Customer.get({id: $stateParams.id}, function(data) {
      $scope.model = customer;
    });

    $scope.updateUser = function(evt) {
      customer.$save({id: $scope.model.customer.id}, function (data) {
        Flash.create('success', 'Customer updated successfully!');
      }, function (error) {
        $scope.customerErrors = error.data.errors;
        Flash.create('danger', 'Something happened. See errors below.');
      });
    };
  });
'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AboutCtrl', function ($scope, $http, Customer, ENV, Flash) {
   $scope.config = {
    itemsPerPage: 10
	};

  $scope.selected = 1;
  $scope.Flash=Flash;

  // Retrieves pages 1
  Customer.query(function(data) {
    $scope.customers = data;
    $scope.custList = data.customers;
  });

  $scope.isActive = function(index) {
        return $scope.selected === index;
  };

  // Paginate
  $scope.gotopage = function(index){
    $scope.selected = index;
    Customer.query({page: index}, function(data) {
      $scope.customers = data;
      $scope.custList = data.customers;
    });
  };

  $scope.pagerange = function(min, max, step){
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  }

  $scope.findCustomers = function(search_by_firstname,search_by_lastname,search_by_email,search_by_phone){
    var params = {};
    
    if (!angular.isUndefined(search_by_firstname) && search_by_firstname.trim()!="" ) {
      params['q[firstname_cont]'] = search_by_firstname;
    }
    
    if (!angular.isUndefined(search_by_lastname) && search_by_lastname.trim()!="" ) {
      params['q[lastname_cont]'] = search_by_lastname;
    }
    
    if (!angular.isUndefined(search_by_email) && search_by_email.trim()!="" ) {
      params['q[email_eq]'] = search_by_email;
    }
    
    if (!angular.isUndefined(search_by_phone) && search_by_phone.trim()!="" ) {
      params['q[phone_numbers_number_cont]'] = search_by_phone;
    }
    
    Customer.search(params, function(data) {
      $scope.customers = data;
      $scope.custList = data.customers;
    });
  };
});


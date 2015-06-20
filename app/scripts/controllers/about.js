'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AboutCtrl', function ($scope,$http,ENV,Flash) {
   $scope.config = {
    itemsPerPage: 10
	}
  $scope.selected = 1;
  $scope.Flash=Flash;
  $scope.isActive = function(index) {
        return $scope.selected === index;
 };
  $scope.gotopage = function(index){
    $scope.selected = index;

      $http({
        method: 'GET',
        url: ENV.apiEndpoint + '/api/v1/customers?page='+index,
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.customers= data;
        $scope.custList = data.customers;
    }).error(function(){
        alert("error");
    })
  }

  $http({
        method: 'GET',
        url: ENV.apiEndpoint + '/api/v1/customers',
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){

        $scope.customers= data;
        $scope.custList = data.customers;
    }).error(function(){
        alert("error");
    })
  $scope.pagerange = function(min, max, step){
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  }


  $scope.findCustomers = function(search_by_firstname,search_by_lastname,search_by_email,search_by_phone){
    var query_params=[];
    
    if (!angular.isUndefined(search_by_firstname) && search_by_firstname.trim()!="" )
    {
      query_params.push('q[firstname_cont]=' + search_by_firstname);
    }
    
    if (!angular.isUndefined(search_by_lastname) && search_by_lastname.trim()!="" )
    {
      query_params.push('q[lastname_cont]=' + search_by_lastname);
    }
    
    if (!angular.isUndefined(search_by_email) && search_by_email.trim()!="" )
    {
      query_params.push('q[email_eq]=' + search_by_email);
    }
    
    if (!angular.isUndefined(search_by_phone) && search_by_phone.trim()!="" )
    {
      query_params.push('q[phone_numbers_number_cont]=' + search_by_phone);
    }
    
    var query_string=""
    var i=0;
    for (i=0;i<query_params.length;i++)
    {
      if (i>0)
      {
        query_string=query_string + "&";
      }
      query_string+= query_params[i];
    }

    if (query_string!="")
    {
      query_string="?" + query_string;
    }
    
    
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/api/v1/customers' + query_string,
      headers: {
        'Content-type': 'application/json'
      }
    })
    .success(function(data){
      $scope.customers= data;
      $scope.custList = data.customers;
    }).error(function(){
      alert("error");
    })
    
  };
  });


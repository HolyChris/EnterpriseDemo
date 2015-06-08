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


  });


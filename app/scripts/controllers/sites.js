'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('SitesCtrl', function ($scope,$http) {

  $scope.config = {
    itemsPerPage: 10
	}
  $scope.state_abb = ["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR",
                      "NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA",
                      "MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN",
                      "TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT",
                      "NY","SC","AK","WV","AA","AE","AP"];
  $scope.selected = 1;

  $scope.isActive = function(index) {
    return $scope.selected === index;
  };

  $scope.gotopage = function(index){
    $scope.selected = index;

    $http({
      method: 'GET',
      url: 'http://54.68.73.69/api/v1/sites?page=' + index,
      headers: {
        'Content-type': 'application/json'
      }
    })
    .success(function(data){
      $scope.sites= data;
      $scope.siteList = data.sites;
    }).error(function(){
      alert("error");
    })
  }

  $scope.pagerange = function(min, max, step){
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  };

  $http({
    method: 'GET',
    url: 'http://54.68.73.69/api/v1/sites',
    headers: {
      'Content-type': 'application/json'
    }
  })
  .success(function(data){
    $scope.sites = data;
    $scope.siteList = data.sites;
  }).error(function(){
    alert("error");
  })
});


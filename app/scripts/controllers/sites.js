'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('SitesCtrl', function ($scope,$http,ENV) {

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
      url: ENV.apiEndpoint + '/api/v1/sites?page=' + index,
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
  
  $scope.findSites = function(search_by_manager,search_by_name,search_by_address,search_by_city,search_by_state_id,search_by_zipcode){
    
    
    var query_params=[];
    
    if (!angular.isUndefined(search_by_manager) && search_by_manager.trim()!="" )
    {
      query_params.push('q[managers_email_eq]=' + search_by_manager);
    }
    
    if (!angular.isUndefined(search_by_name) && search_by_name.trim()!="" )
    {
      query_params.push('q[name_cont]=' + search_by_name);
    }
    
    if (!angular.isUndefined(search_by_address) && search_by_address.trim()!="" )
    {
      query_params.push('q[address_address1_cont]=' + search_by_address);
    }
    
    if (!angular.isUndefined(search_by_city) && search_by_city.trim()!="" )
    {
      query_params.push('q[address_city_cont]=' + search_by_city);
    }
    
    if (!angular.isUndefined(search_by_state_id) && search_by_state_id.trim()!="" )
    {
      query_params.push('q[address_state_id_eq]=' + search_by_state_id);
    }
    
    if (!angular.isUndefined(search_by_zipcode) && search_by_zipcode.trim()!="" )
    {
      query_params.push('q[address_zipcode_eq]=' + search_by_zipcode);
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
      url: ENV.apiEndpoint + '/api/v1/sites' + query_string,
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
    
  };

  $http({
    method: 'GET',
    url: ENV.apiEndpoint + '/api/v1/sites',
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


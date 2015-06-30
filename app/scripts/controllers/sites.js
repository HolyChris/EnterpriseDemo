'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('SitesCtrl', function ($scope,Sites,Managers,ENV) {

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

    Sites.query(angular.extend({page: index},$scope.query_params), function(data) {
      $scope.sitesResponse = data;
      $scope.siteList=data.sites; 
    },function(error) {
      $scope.errors = error.data.errors;
      Flash.create('danger', 'Something happened. Sites could not be queried.');
      }
    );


  }

  $scope.pagerange = function(min, max, step){
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  };
  
  $scope.findSites = function(search_by_manager,search_by_name,search_by_address,search_by_city,search_by_state_id,search_by_zipcode){
    
    
    $scope.query_params={};
    
    if ($scope.selected_manager)
    {
      $scope.query_params['q[managers_email_eq]'] = $scope.selected_manager.email;
    }

    if (!angular.isUndefined(search_by_name) && search_by_name.trim()!="" )
    {
      $scope.query_params['q[name_cont]'] = search_by_name;
    }
    
    if (!angular.isUndefined(search_by_address) && search_by_address.trim()!="" )
    {
      $scope.query_params['q[address_address1_cont]']=search_by_address;
    }
    
    if (!angular.isUndefined(search_by_city) && search_by_city.trim()!="" )
    {
      $scope.query_params['q[address_city_cont]']= search_by_city;
    }
    
    if (!angular.isUndefined(search_by_state_id) && search_by_state_id.trim()!="" )
    {
      $scope.query_params['q[address_state_id_eq]'] = search_by_state_id;
    }
    
    if (!angular.isUndefined(search_by_zipcode) && search_by_zipcode.trim()!="" )
    {
      $scope.query_params['q[address_zipcode_eq]'] = search_by_zipcode;
    }   
    
    Sites.query($scope.query_params, function(data) {
        $scope.sitesResponse = data;
        $scope.siteList=data.sites;
        $scope.selected = 1;
      },function(error) {
        $scope.errors = error.data.errors;
        Flash.create('danger', 'Something happened. Sites could not be queried.');
        }
      );
  };


  $scope.query_params={};
  //By default when page first loads we query all sites
  Sites.query({}, function(data) {
      $scope.sitesResponse = data;
      $scope.siteList=data.sites;
    },function(error) {
      $scope.errors = error.data.errors;
      Flash.create('danger', 'Something happened. Sites could not be queried.');
      }
    );

  //We also query managers to make them available on the writeahead Manager search field
  $scope.managersArray = Managers.query();

});


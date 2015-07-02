'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('SitesCtrl', function ($scope, $stateParams, Sites, Managers, ENV) {

  $scope.config = {
    itemsPerPage: 10
	};

  $scope.searchForm = {};

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
    $scope.search(undefined, index)
  };

  $scope.pagerange = function(min, max, step){
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  };
  
  function querify(string) {
    // given a string add q[string]
    return 'q[' + string + ']';
  }

  $scope.search = function(form, page){
    form = form || $scope.searchForm;
    var params = {page: page || 1};

    angular.forEach(form, function(value, key) {
      if (value) {
        params[querify(key)] = value.trim();
      }
    });

    Sites.query(params, function(data) {
      $scope.sites = data;
      $scope.siteList = data.sites;
    });
  };

  function cleanQueryParams() {
    var params = {};
    angular.forEach($stateParams, function(value, key) {
      if (value) {
        params[key] = value;
        // add to scope to be present on search form
        $scope.searchForm[key] = value;
      }
    });
    return params;
  }

  // Show initial list with "quick link filter if any"
  $scope.search(cleanQueryParams());
  //We also query managers to make them available on the writeahead Manager search field
  $scope.managersArray = Managers.query();
});


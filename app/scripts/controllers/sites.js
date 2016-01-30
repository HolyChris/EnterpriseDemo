'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('SitesCtrl', function ($scope, $location, $stateParams, Sites, Managers, ENV, Address) {

  $scope.config = {
    itemsPerPage: 10
	};

  window.analytics.page( 'All Sites', {
    name: $location.path()
  });

  $scope.searchForm = {};

  $scope.states_array=Address.States;
  $scope.stateLookupById=Address.stateLookupById;

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


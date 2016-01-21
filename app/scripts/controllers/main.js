'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $window, $location, $timeout, Sites, SitesResourceService, ENV, $state) {
    // Site listings
    $scope.loadingRecent = true;
    SitesResourceService.recent().then(function(response) {
        $scope.loadingRecent = false;
        $scope.recent_sites = response;
    });

    $scope.loadingOpportunity = true;
    SitesResourceService.opportunities().then(function(response) {
        $scope.loadingOpportunity = false;
        $scope.opportunities = response;
    });

    $scope.loadingContracts = true;
    SitesResourceService.contracts().then(function(response) {
        $scope.loadingContracts = false;
        $scope.contracts = response;
    });

    $scope.loadingProductions = true;
    SitesResourceService.productions().then(function(response) {
        $scope.loadingProductions = false;
        $scope.productions = response;
    });

    $scope.loadingBillings = true;
    SitesResourceService.billings().then(function(response) {
        $scope.loadingBillings = false;
        $scope.billings = response;
    });

    $scope.updateStage = function (model, column) {
        var site = model.item;
        column.getModel().items.unshift(site);
        var previousColumnItems = model.previousColumn.getModel().items;
        var previousColumnIndex = previousColumnItems.indexOf(site);
        if(previousColumnIndex > -1)
            previousColumnItems.splice(previousColumnIndex, 1);

        site.stage = column.type;
        site.save().then(function () {
            site.loading = false;
            $state.go('project.' + column.type, { projectId: site.id });
        });
        site.loading = true;

        if(!$scope.$$phase)
            $scope.$apply();
    }

    $scope.columns = [
        {
            title: 'Opportunity',
            createSref: 'newcustomer',
            getModel: function() { return $scope.opportunities; },
            isLoading: function() { return $scope.loadingOpportunity; },
            type: 'opportunity',
            accepts: []
        },
        {
            title: 'Under Contract',
            getModel: function() { return $scope.contracts; },
            isLoading: function() { return $scope.loadingContracts; },
            type: 'contract',
            accepts: ['opportunity', 'production']
        },
        {
            title: 'Production',
            getModel: function() { return $scope.productions; },
            isLoading: function() { return $scope.loadingProductions; },
            type: 'production',
            accepts: ['contract', 'billing']
        },
        {
            title: 'Billing',
            getModel: function() { return $scope.billings; },
            isLoading: function() { return $scope.loadingBillings; },
            type: 'billing',
            accepts: ['production']
        }
    ];

    $scope.quickSearch = function(key) {
        var params = {};
        params[key] = $scope[key];
        if ($scope[key]) {
            $state.go("sites", params);
        }
    };
});


'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $window, $location, $timeout, Sites, SitesResourceService, ENV, $state, Customer, $q) {
    // Site listings
    $scope.loadingRecent = true;
    SitesResourceService.recent().then(function(response) {
        angular.forEach(response.data, function(site) {
            // Site attributes already have customer info so makes more sense to add this in the backend
            var customerId = site.attributes.customer.id;
            var customer = Customer.get({id: customerId}, function(data) {
                site.attributes.customer.phone_numbers = data.customer.phone_numbers

                $scope.loadingRecent = false;
                $scope.recent_sites = response;
            });
        });
    });

    $scope.loadingOpportunity = true;
    SitesResourceService.opportunities().then(function(response) {
        angular.forEach(response.data, function(site) {
            // Site attributes already have customer info so makes more sense to add this in the backend
            var customerId = site.attributes.customer.id;
            var customer = Customer.get({id: customerId}, function(data) {
                site.attributes.customer.phone_numbers = data.customer.phone_numbers

                $scope.loadingOpportunity = false;
                $scope.opportunities = response;
            });
        });
    });

    $scope.loadingContracts = true;
    SitesResourceService.contracts().then(function(response) {
        angular.forEach(response.data, function(site) {
            // Site attributes already have customer info so makes more sense to add this in the backend
            var customerId = site.attributes.customer.id;
            var customer = Customer.get({id: customerId}, function(data) {
                site.attributes.customer.phone_numbers = data.customer.phone_numbers

                $scope.loadingContracts = false;
                $scope.contracts = response;
            });
        });
    });

    $scope.loadingProductions = true;
    SitesResourceService.productions().then(function(response) {
        angular.forEach(response.data, function(site) {
            // Site attributes already have customer info so makes more sense to add this in the backend
            var customerId = site.attributes.customer.id;
            var customer = Customer.get({id: customerId}, function(data) {
                site.attributes.customer.phone_numbers = data.customer.phone_numbers

                $scope.loadingProductions = false;
                $scope.productions = response;
            });
        });
    });

    $scope.loadingBillings = true;
    SitesResourceService.billings().then(function(response) {
        angular.forEach(response.data, function(site) {
            // Site attributes already have customer info so makes more sense to add this in the backend
            var customerId = site.attributes.customer.id;
            var customer = Customer.get({id: customerId}, function(data) {
                site.attributes.customer.phone_numbers = data.customer.phone_numbers

                $scope.loadingBillings = false;
                $scope.billings = response;
            });
        });
    });

    $scope.clickPhoneNumber = function(customer, $event) {
        $event.preventDefault();
        window.location.href="tel://"+customer.phone_numbers[0].number;
    };

    $scope.updateStage = function (model, column) {
        var site = model.item;
        var t = column.getModel();

        if (t) {
          items.unshift(site);
        }

        var previousColumnItems = model.previousColumn.getModel().items;
        var previousColumnIndex = previousColumnItems.indexOf(site);
        if(previousColumnIndex > -1)
            previousColumnItems.splice(previousColumnIndex, 1);

        if(column.type == 'contract')
            $state.go('project.contract', { projectId: site.id });
        else {
            site.stage = column.type;
            site.save().then(function () {
                site.loading = false;
                $state.go('project.' + column.type, {projectId: site.id});
            });
            site.loading = true;
        }
    }

    $scope.columns = [
        {
            title: 'Opportunity',
            createSref: 'newcustomer',
            getModel: function() { return $scope.opportunities; },
            isLoading: function() { return $scope.loadingOpportunity; },
            type: 'opportunity',
            accepts: [],
            itemUrl: function(item) { return '/#/projects/' + item.id + '/overview' }
        },
        {
            title: 'Under Contract',
            getModel: function() { return $scope.contracts; },
            isLoading: function() { return $scope.loadingContracts; },
            type: 'contract',
            accepts: ['opportunity', 'production'],
            itemUrl: function(item) { return '/#/projects/' + item.id + '/contract' }
        },
        {
            title: 'Production',
            getModel: function() { return $scope.productions; },
            isLoading: function() { return $scope.loadingProductions; },
            type: 'production',
            accepts: ['contract', 'billing'],
            itemUrl: function(item) { return '/#/projects/' + item.id + '/production' }
        },
        {
            title: 'Billing',
            getModel: function() { return $scope.billings; },
            isLoading: function() { return $scope.loadingBillings; },
            type: 'billing',
            accepts: ['production'],
            itemUrl: function(item) { return '/#/projects/' + item.id + '/billing' }
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


'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, $window, $location, $timeout, Sites, v2Sites, ENV, $state,Address) {
    // Site listings
        v2Sites.query(function(response) {
            console.log(response);
        });
    //$scope.recent_sites = Sites.query();
    //$scope.opportunities = Sites.query({stage: 'Opportunity'});
    //$scope.contracts = Sites.query({stage: 'UnderContract'});
    //$scope.productions = Sites.query({stage: 'Production'});
    //$scope.billings = Sites.query({stage: 'Billing'});

    $rootScope.isFront = true;
    $rootScope.$on('$locationChangeStart', function(event) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if ($state.current.url === '/') {
            $rootScope.isFront = true;
        } else {
            $rootScope.isFront = false;
        }
    });

    function updateStage(siteId, stage) {
        // Return a promise so then we ca transition the page
        return Sites.save({
            siteId: siteId,
            current_stage: stage
        });
    }

    $scope.sortableOptionsList = [{
        // Card placed in Opportunity Column
        connectWith: '#con-cards',
        placeholder: 'card-highlight',
        cursor: '-webkit-grabbing',
        items: '.pipe-card:not(.create-opp)'
    }, {
        // Card placed in Contract Column
    	connectWith:'#pro-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
        // When recieving a card
        receive: function(event, ui) {
            var siteId = getSiteId(ui.item[0].id);
            $state.go("project.contract",{projectId: siteId});
        }
    }, {
        // Card placed in Production Column
    	connectWith:'#con-cards,#post-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
        // When recieving a card
        receive: function(event, ui) {
            var siteId = getSiteId(ui.item[0].id);
            updateStage(siteId, 'production').$promise.then(function() {
                $state.go("project.production",{projectId: siteId});
            });
        }
    }, {
        // Card placed in Billing Column
    	connectWith:'#pro-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
        // When recieving a card
        receive: function(event, ui) {
            var siteId = getSiteId(ui.item[0].id);
            updateStage(siteId, 'billing').$promise.then(function() {
                $state.go("project.billing",{projectId: siteId});
                
            });
        }
    }];

    $scope.statusOrder = function(opportunity) {
        var order = 2;
        var status = opportunity.status;
        if (status === 'Good') {
            order = 1;
        } else if (status === 'Bad') {
            order = 3;
        } else if (status === 'Dead') {
            order = 4;
        }
        return order;
    };

    $scope.states_array = Address.States;
    $scope.stateLookupById=Address.stateLookupById;

    $scope.quickSearch = function(key) {
        var params = {};
        params[key] = $scope[key];
        if ($scope[key]) {
            $state.go("sites", params);
        }
    };

    function getSiteId(id) {
        var siteId = id.replace('site-', '');
        return siteId;
    };
});


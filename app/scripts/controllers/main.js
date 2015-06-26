'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('MainCtrl', function ($scope, $http, $window, $location, Sites, ENV, $auth) {
    var oldList, newList, item;

    $scope.sortableOptionsList = [
    {
 		placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
    	items: '.pipe-card:not(.create-opp)',
        start: function(event, ui) {
                item = ui.item;
                newList = oldList = ui.item.parent();
            },
            stop: function(event, ui) {
                $location.path('/overview/contract');
            },
            change: function(event, ui) {
                if(ui.sender) newList = ui.placeholder.parent();
            },

        connectWith: '#con-cards',
    },
    {
    	connectWith:'#pro-cards,#opp-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
         start: function(event, ui) {
                item = ui.item;
                newList = oldList = ui.item.parent();
            },
            stop: function(event, ui) {
                $location.path('/overview/production');
            },
            change: function(event, ui) {
                if(ui.sender) newList = ui.placeholder.parent();
            }
    },
    {
    	connectWith:'#con-cards,#post-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
        start: function(event, ui) {
                item = ui.item;
                newList = oldList = ui.item.parent();
            },
            stop: function(event, ui) {
            },
            change: function(event, ui) {
                if(ui.sender) newList = ui.placeholder.parent();
            }
    },
    {
    	connectWith:'#pro-cards,#close-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
        start: function(event, ui) {
                item = ui.item;
                newList = oldList = ui.item.parent();
            },
            stop: function(event, ui) {
            },
            change: function(event, ui) {
                if(ui.sender) newList = ui.placeholder.parent();
            }
    },
    {
    	connectWith:'#post-cards',
    	placeholder: 'card-highlight',
    	cursor: '-webkit-grabbing',
    	items: '.pipe-card:not(.out-amount)',
        start: function(event, ui) {
                item = ui.item;
                newList = oldList = ui.item.parent();
            },
            stop: function(event, ui) {
            },
            change: function(event, ui) {
                if(ui.sender) newList = ui.placeholder.parent();
            }
    }
    ];
    $scope.state_abb = ["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR",
                        "NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA",
                        "MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN",
                        "TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT",
                        "NY","SC","AK","WV","AA","AE","AP"];

    // Site listings
    $scope.recent_sites = Sites.query();
    $scope.opportunities = Sites.query({stage: 'Opportunity'});
    $scope.contracts = Sites.query({stage: 'UnderContract'});
    $scope.productions = Sites.query({stage: 'Production'});
    $scope.billings = Sites.query({stage: 'Billing'});
});


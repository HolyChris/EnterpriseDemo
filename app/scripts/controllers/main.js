'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('MainCtrl', function ($scope, $http, $window, $location, Sites, ENV, $state) {
    var oldList, newList, item;
    angular.element('.main-container').addClass('.dashboard-container')

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
            var siteId = getSiteId(ui.item[0].id);
            if (ui.position.left - ui.originalPosition.left > 150) {
                $state.go("project.contract",{projectId: siteId})
            }
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
            var siteId = getSiteId(ui.item[0].id);
            if (ui.position.left - ui.originalPosition.left > 150) {
                $state.go("project.production",{projectId: siteId})
            }
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
            var siteId = getSiteId(ui.item[0].id);
            if (ui.position.left - ui.originalPosition.left > 150) {
                $state.go("project.billing",{projectId: siteId})
            }
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
    }

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

    $scope.quickSearch = function(key) {
        var params = {};
        params[key] = $scope[key];
        if ($scope[key]) {
            $state.go("sites", params);
        }


    }

    function getSiteId(id) {
        var siteId = id.replace('site-', '');
        return siteId;
    }
});


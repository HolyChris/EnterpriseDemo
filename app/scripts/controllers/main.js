'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
.run(function($http) {
  $http.defaults.headers.common= { 'X-Auth-Token' : 'D2EdWKgbs8cq9PHyLhrA' };
})
  .controller('MainCtrl', function ($scope,$http,$window,$location) {
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

   $http({
        method: 'GET',
        url: 'http://54.68.73.69/api/v1/sites',
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.recent_sites = data;
    }).error(function(){
        alert("error");
    });

    $http({
        method: 'GET',
        url: 'http://54.68.73.69/api/v1/sites?stage=Opportunity',
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.oppurtunities = data;
    }).error(function(){
        alert("error");
    });

     $http({
        method: 'GET',
        url: 'http://54.68.73.69/api/v1/sites?stage=UnderContract',
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.contracts = data;
    }).error(function(){
        alert("error");
    });

     $http({
        method: 'GET',
        url: 'http://54.68.73.69/api/v1/sites?stage=Production',
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.productions = data;
    }).error(function(){
        alert("error");
    });

     $http({
        method: 'GET',
        url: 'http://54.68.73.69/api/v1/sites?stage=Billing',
         headers: {
        'Content-type': 'application/json'
        }
     }).success(function(data){
        $scope.billings = data;
    }).error(function(){
        alert("error");
    });

})
  

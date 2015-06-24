'use strict';

/**
 * @ngdoc overview
 * @name ersApp
 * @description
 * # ersApp
 *
 * Main module of the application.
 */
angular
  .module('ersApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.sortable',
    'ui.router',
    'ui.bootstrap',
    'angular-table',
    'flash',
    'ui.bootstrap',
    'sitesService',
    'customersService',
    'overviewService',
    'managersService',
    'config'
    ])
  .config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouteProvider) {
    $stateProvider
      .state('main', {
        url:'/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .state('customers', {
        url:'/customers',
        templateUrl: 'views/customer.html',
        controller: 'AboutCtrl',
      })
      .state('customersdetails',{
        url:'/customers/details/:id',
        templateUrl:'views/customer_overview.html',
        controller: "CustomerCtrl"
      })
      .state('newcustomer', {
        url:'/customers/new',
        templateUrl: 'views/new_customer.html',
        controller: 'NewCustomerCtrl',
      })

      .state('sites',{
        url:'/sites',
        templateUrl: 'views/sites.html',
        controller: 'SitesCtrl',
      })
      .state('newsite', {
        url:'/sites/new',
        templateUrl: 'views/new_site.html',
        controller: 'NewSiteCtrl',
      })
      .state('overview',{
        url:'/overview',
        templateUrl:'views/overview.html',
        controller: 'OverviewCtrl',
      })
      .state('overview.project',{
        url:'/project',
        templateUrl:'views/overview_project.html',
      })
      .state('overview.contract',{
        url:'/contract',
        templateUrl:'views/overview_contract.html',
      })
      .state('overview.project_doc',{
        url:'/project-documents',
        templateUrl:'views/overview_project_doc.html',
      })
      .state('overview.project_doc.photos',{
        url:'/photos',
        templateUrl:'views/overview_project_doc-photos.html',
      })
      .state('overview.production',{
        url:'/production',
        templateUrl:'views/overview_production.html',
      })
      ;
      $urlRouteProvider.otherwise('/');

  }]);


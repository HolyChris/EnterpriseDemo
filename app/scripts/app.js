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
    'config',
    'angularSpinner',
    'satellizer'
    ])
  .config(['$stateProvider','$urlRouterProvider', '$authProvider', function ($stateProvider, $urlRouteProvider, $authProvider) {
    
    // Parametros de configuración
    $authProvider.loginUrl = 'http://54.68.73.69' + '/api/v1/sign_in';
    $authProvider.signupUrl = 'http://54.68.73.69' + '/api/v1/sign_up';
    $authProvider.logoutRedirect = "/login";
    $authProvider.tokenName = 'auth_token';
    $authProvider.tokenPrefix = 'ersA';
    $authProvider.authHeader = 'X-Auth-Token';
    $authProvider.authToken = '';

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

      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        // by default all controllers are required to be logged
        // do this for having a public page
        requireLogin: false
      });
      $urlRouteProvider.otherwise('/');
  }])
  .run(function ($rootScope, $state, $auth, $location) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      if ($auth.isAuthenticated()) {
        $rootScope.isAuthenticated = true;
      } else {
        $rootScope.isAuthenticated = false;
      }
      if (toState.name !== "login" && $rootScope.isAuthenticated === false) {
        // If not authenticated go to login state, if not already there
        $state.go("login");
        event.preventDefault();
      } 
    });
});
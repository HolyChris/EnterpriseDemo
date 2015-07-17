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
    'assetsService',
    'usersService',
    'appointmentsService',
    'projectService',
    'billingService',
    'productionService',
    'addressesService',
    'config',
    'angularSpinner',
    'blueimp.fileupload',
    'satellizer',
    'ng-currency'
    ])
  .config(['$stateProvider','$urlRouterProvider', '$authProvider', 'ENV', function ($stateProvider, $urlRouteProvider, $authProvider, ENV) {
  
    // Parametros de configuración
    $authProvider.loginUrl = ENV.apiEndpoint + '/api/v1/sign_in';
    $authProvider.signupUrl = ENV.apiEndpoint + '/api/v1/sign_up';
    $authProvider.logoutRedirect = "/login";
    $authProvider.tokenName = 'auth_token';
    $authProvider.tokenPrefix = 'ersA';
    $authProvider.authHeader = 'X-Auth-Token';
    $authProvider.authToken = '';
    $authProvider.tokenRoot = 'user';

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
        params: {'contract_po_number_contains': null, 'address_address1_cont': null, 'contact_name_contains': null}
      })
      .state('newsite', {
        url:'/sites/new',
        templateUrl: 'views/new_site.html',
        controller: 'NewSiteCtrl',
      })
      .state('project',{
        url:'/projects/:projectId',
        templateUrl:'views/overview.html',
        controller: function($stateParams, $scope, Sites){

          $scope.project_id = $stateParams.projectId;
          $scope.globalData = {};
          $scope.site = {};
          $scope.enableProjectDetails = true;
          $scope.enableProduction = true;
          $scope.enableBilling = true;
          $scope.editStageMode = false;
          $scope.stagesList = [
            {
              value: "Under Contract",
              label: "Under Contract",
            }, {
              value: "Production",
              label: "Production",
            }, {
              value: "Billing",
              label: "Billing",
            }
          ];

          $scope.updateStage = function() {
            // need to convert to values accepted by backend ...
            var hash = {
              'Under Contract': 'contract',
              'Production': 'production',
              'Billing': 'billing'
            };
            
            Sites.save({
              siteId: $scope.project_id,
              current_stage: hash[$scope.site.stage]
            }, function() {
              $scope.disableStageEdition();
            })
          }

          $scope.enableStageEdition = function() {
            $scope.editStageMode = true;
          };

          $scope.disableStageEdition = function() {
            $scope.editStageMode = false;
          };

          $scope.refreshNavStatus = function () {
            $scope.globalData = Sites.get({siteId: $stateParams.projectId}, function(data) {
              $scope.setNavStatus(data.site);
              $scope.site = data.site;
            });
          };

          $scope.setNavStatus = function (site) {
            if (site.stage === "Opportunity") {
              // No Contract yet
              $scope.enableProjectDetails = false;
              $scope.enableProduction = false;
              $scope.enableBilling = false;
            }
          };

          $scope.refreshNavStatus();
        }
        
      })
      .state('project.overview',{
        url:'/overview/',
        views:{
          "overview-content-view" : {templateUrl: 'views/overview_project.html',controller: 'OverviewCtrl'}
        }
        
      })
      .state('project.contract',{
        url:'/contract',
        views:{
          "overview-content-view" : {templateUrl:'views/overview_contract.html', controller: 'OverviewCtrl'}
        }
      })
      .state('project.documents',{
        url:'/documents',
        views:{
          "overview-content-view" : {templateUrl:'views/overview_project_doc.html'}
        }
      })
      .state('project.appointments',{
        url:'/appointments',
        views:{
          "overview-content-view" : {templateUrl:'views/overview_appointments.html', controller: 'AppointmentsCtrl'}
        }
        
      })
      .state('project.project_details',{
        url:'/project_details',
        views:{
          "overview-content-view" : {templateUrl:'views/overview_project_details.html', controller: 'ProjectCtrl'}
        }
        
      })
      .state('project.production',{
        url:'/production',
        views:{
          "overview-content-view" : {
            templateUrl:'views/overview_production.html', 
            controller: 'ProductionCtrl'
          }
        }
      })
      .state('project.billing',{
        url:'/billing',
        views:{
          "overview-content-view" : {templateUrl:'views/overview_billing.html', controller: 'BillingCtrl'}
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        // by default all controllers are required to be logged
        // do this for having a public page
        requireLogin: false
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'views/login.html',
        controller: 'LogoutCtrl',
        // by default all controllers are required to be logged
        // do this for having a public page
        requireLogin: false
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
      });

      $urlRouteProvider.otherwise('/');
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$location', '$q', function($location, $q) {
      return {
       'responseError': function (response) {
          // Actually not logged in should be a 401
          // this is error prone as it meand resource not found
          // but our API doensnt sent something good for
          if (response.status === 404) {
            if (response.data.message && response.data.message === "User not authorized to perform the operation") {
              $location.path('/login');
              return $q.reject(response);
            }
          }
          if (response.status === 422) {
            return response;
          }
          return $q.reject(response);
        }
      }
    }]);
  }])
  .run(function ($rootScope, $state, $auth, $location) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      if ($auth.isAuthenticated()) {
        $rootScope.isAuthenticated = true;
      } else {
        $state.go('login');
        $rootScope.isAuthenticated = false;
      }
      if (toState.name !== "login" && $rootScope.isAuthenticated === false) {
        // If not authenticated go to login state, if not already there
        $state.go("login");
        event.preventDefault();
      } 
    });
});
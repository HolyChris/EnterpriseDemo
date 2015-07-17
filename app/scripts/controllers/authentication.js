angular.module('ersApp')
  .controller('LoginCtrl', function($scope, $auth, $location, $rootScope, Flash, usSpinnerService) {
    $rootScope.isAuthenticated = false;
    $rootScope.showSite = true;
    $scope.signUp = function() {
      usSpinnerService.spin('login-spinner');
      $auth.logout();
      if (!$scope.model) {
        Flash.create('danger', 'Please provide Email and Password');
        return;
      }
      $auth.login({
        email: $scope.model.email,
        password: $scope.model.password
      })
      .then(function(response) {
        usSpinnerService.stop('login-spinner');
        if (response.data.message) {
          Flash.create('danger', response.data.message);
        } else {
          $rootScope.userEmail = response.data.email;
          $location.path("/"); 
        }
      })
      .catch(function(response) {
        // API doesn't return proper validation messages
        // so I'm unable to highlight the input here
        usSpinnerService.stop('login-spinner');
        Flash.create('danger', response.data.message);
        return;
      });
    };

    $scope.showResetForm = function() {
      $scope.resetPassword = true;
    };

    $scope.sendResetPassword = function() {
      // call api for sending reset instructions here
      $scope.resetPassword = false;
    };

  })
  .controller('LogoutCtrl', function($scope, $auth, $location, $state, $http, ENV, $rootScope) {
      // first delete token from server, do it before .logout() so it sends
      // auth headers for this api
      $rootScope.isAuthenticated = false;
      $http.delete(ENV.apiEndpoint + "/api/v1/sign_out").success(function() {
        $auth.logout()
          .then(function() {
              $location.path('/login')
          })
          .catch(function(response) {
              console.log("Error", response);
          });
      });
  });


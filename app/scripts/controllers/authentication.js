angular.module('ersApp')
  .controller('LoginCtrl', function($scope, $auth, $location, $rootScope, Flash) {
    $scope.signUp = function() {

      if (!$scope.model) {
        Flash.create('danger', 'Please provide Email and Password');
        return;
      }

      $auth.login({
          email: $scope.model.email,
          password: $scope.model.password
      })
      .then(function(response) {
        console.log(response);
          $rootScope.userEmail = response.data.email;
          $location.path("/");
      })
      .catch(function(response) {
        // API doesn't return proper validation messages
        // so I'm unable to highlight the input here
        Flash.create('danger', response.data.message);
        return;
      });
    };

    $scope.showResetForm = function() {
      console.log("Reset");
      $scope.resetPassword = true;
    };

    $scope.sendDesetPassword = function() {
      // call api for sending reset instructions here
      $scope.resetPassword = false;
    };

  })
  .controller('LogoutCtrl', function($scope, $auth, $location, $state, $http, ENV, $rootScope) {
    $scope.logout = function() {
      // first delete token from server, do it before .logout() so it sends
      // auth headers for this api
      $http.delete(ENV.apiEndpoint + "/api/v1/sign_out").success(function() {
        $auth.logout()
          .then(function() {
              $state.go("login");
          })
          .catch(function(response) {
              console.log("Error", response);
          });
      });
    };
  });


angular.module('ersApp')
  .controller('ResetPasswordCtrl', function($scope, $stateParams, $state, $http, $rootScope, Flash, ENV) {
    console.log("HERE")
    $scope.model = {};
    $rootScope.isAuthenticated = false;
    $scope.model.password = "";
    $scope.model.passwordTest = $scope.model.password.length;
    $scope.model.password_confirmation = "";


    $scope.sendResetPassword = function() {
      console.log('send reset');
      var params =
        "reset_password_token=" + $stateParams.reset_password_token + "&" + 
        "password=" + $scope.model.password + "&" +
        "password_confirmation=" + $scope.model.password_confirmation;

      if ($scope.model.password && $scope.model.password === $scope.model.password_confirmation) {
        $http.put(ENV.apiEndpoint + "/api/v1/users/password?" + params).then(function(data) {
          // Flash.create('success', data.message);
          if (data.status === 422) {
            if (data.data.errors.reset_password_token) {
              Flash.create('danger', "Invalid token");
            } else {
              Flash.create('danger', "Something wrong happen!");
            }
          } else {
            $state.go('login');
          }
        });
      } else {
        Flash.create('danger', "Password doesn't match");
      }
    }

    $scope.testPassword = function() {
      return $scope.model.password != $scope.model.password_confirmation || $scope.model.password.length < 8;
    }
  });
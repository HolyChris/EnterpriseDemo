angular.module('ersApp')
  .controller('SettingsCtrl', function($scope, $location, $rootScope, User, Flash, $auth, $state) {
    $scope.data = {};
    // This is not ideall but it's the only way to retrieve userd data
    // we dont have a client id in frontend
    var user = User.resource.save(function(data) {
      $scope.data.fullname = data.user.fullname;
      $scope.data.email = data.user.email;
    });

    window.analytics.page( 'Settings', {
      name: $location.path()
    });

    $scope.changePassword = function() {
      // sanitization so it doesn't send empty values
      var params = {};
      angular.forEach($scope.data, function(value, key) {
        if (value !== "") {
          params[key] = value;
        }
      })
      User.resource.save(params, function(data) {
        if (data.user && data.user.auth_token && user.auth_token !== data.user.auth_token) {
          $auth.setToken({data: {user: data.user}}, false);
          $state.go('settings');
        }

        if (data.errors) {
          $scope.errors = {};
          angular.forEach(data.errors, function(value, key) {
            $scope.errors[key] = value[0];
          });
        } else {
          Flash.create('success', 'Settings successfully saved!');
        }
      });
    }
  })
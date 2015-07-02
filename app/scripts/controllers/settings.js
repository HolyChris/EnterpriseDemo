angular.module('ersApp')
  .controller('SettingsCtrl', function($scope, User, Flash) {
    $scope.data = {};
    // This is not ideall but it's the only way to retrieve userd data
    // we dont have a client id in frontend
    var user = User.save(function(data) {
      $scope.data.fullname = data.user.fullname;
      $scope.data.email = data.user.email;
    })

    $scope.changePassword = function() {
      // sanitization so it doesn't send empty values
      var params = {};
      angular.forEach($scope.data, function(value, key) {
        if (value !== "") {
          params[key] = value;
        }
      })
      User.save(params, function(data) {
        if (data.errors) {
          $scope.errors = {};
          console.log("has errors", data.errors)

          angular.forEach(data.errors, function(value, key) {
            $scope.errors[key] = value[0];
          })
        
          console.log($scope.errors)
        }
      });
    }
  })
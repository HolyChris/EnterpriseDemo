angular.module("ersApp")
  .controller("headerCtrl", function($scope, $rootScope, $state, $location, $timeout, $auth, User) {
    // collapse mobile nav on location change.
    $rootScope.$on('$locationChangeSuccess', function(event) {
      angular.element('.navbar-collapse').collapse('hide');
    });

    // This is not ideal but it's the only way to retrieve user data
    // we don't have a client id in frontend
    // If I dont prevent this to happen on resetpasword then it gets redirected to login as it returns 404
    // if the user is logged out
    // Ideally the header controller should't be present on login
    // TODO: Refactor to be a child view , than can be appended same as the Core info does in details
    if ($location.path() !== "/resetpassword" && $location.path() !== "/customerportal") {
      var user = User.resource.save(function(data) {
        $scope.user.fullname = data.user.fullname;
      });
    }

    $scope.searchSites = function() {
      if ($scope['contract_po_number_equals']) {
        $state.go('sites', {'contract_po_number_equals': $scope['contract_po_number_equals']});
      }
    };

    $scope.refreshLoginInfo = function(){
      $scope.user = {};
      $scope.user.email = $auth.getEmail();
    };

    $rootScope.$watch('isAuthenticated',function() {
      $scope.refreshLoginInfo();
    });

    $timeout(function() {
    	if ($rootScope.isAuthenticated) {
    		window.intercomSettings = {
	      	app_id: "upt1rmr7",
	      	name: $scope.user.fullname,
	      	email: $scope.user.email,
	      	created_at: new Date(),
	    	};
  		}
  	}, 1000);
  });
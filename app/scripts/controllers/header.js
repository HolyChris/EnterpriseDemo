angular.module("ersApp")
  .controller("headerCtrl", function($scope, $rootScope, $state, $timeout, $auth, User) {
    
    $scope.user = {};
    $scope.user.email = $auth.getEmail();

    // This is not ideal but it's the only way to retrieve user data
    // we don't have a client id in frontend
    var user = User.save(function(data) {
      $scope.user.fullname = data.user.fullname;
    });

    $scope.searchSites = function() {
      if ($scope['contract_po_number_equals']) {
        $state.go('sites', {'contract_po_number_equals': $scope['contract_po_number_equals']});
      }
    };

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
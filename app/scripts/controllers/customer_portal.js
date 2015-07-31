angular.module('ersApp')
  .controller('PortalCtrl', function($scope, $location, $stateParams, $rootScope, $http, Flash, ENV) {
  	$scope.model = {
  		page_token: $stateParams.token || "",
  		showInvalidTokenMessage: false,
  		customerName: "",
  		auth_token: false,
    	phoneTypes: {
	      1: 'Business',
	      2: 'Home',
	      3: 'Mobile',
	      0: 'Other'
	    }
  	};

  	$rootScope.hideNavigationItems = true;

   	$scope.$on("$destroy", function() {
       $rootScope.hideNavigationItems = false;
    });

  	// /api/v1/customer_session
    $http.get(ENV.apiEndpoint + "/api/v1/customer_session/new?page_token=" + $scope.model.page_token).then(function(data) {
        if (data.status === 422) {
        	$scope.model.showInvalidTokenMessage = true;
        	$scope.model.auth_token = false;
        } else {
        	$scope.model.showInvalidTokenMessage = false;
  	      $scope.model.customerName = data.data.customer.name;
        }
    });

  	$scope.testPONumber = function() {
  		if ($scope.model.PONumber && $scope.model.PONumber.length > 4) {
  			return false;
  		}
  		return true;
  	};

  	$scope.signUp = function() {
      // call api for sending reset instructions here
      $http.post(ENV.apiEndpoint + "/api/v1/customer_session?page_token=" + $scope.model.page_token + "&po_number=" + $scope.model.PONumber).then(function(data) {
        if (data.status === 422 || data.status  === 404) {
        	Flash.create('danger', data.data.message);
        	$scope.model.auth_token = false;
        } else {
  	      $scope.getUserData(data.data.customer_session.auth_token);
        }
      });
  	};

  	$scope.getUserData = function(token) {
  		$scope.model.auth_token = token;
      $http({
      	method: 'GET',
      	url: ENV.apiEndpoint + "/api/v1/customer_portal/customer",
      	headers: {
      		'X-Auth-Token': token,
      		"X-Testing" : "testing"
      	},
      	skipAuthorization: true
    	}).then(function(data) {
        if (data.status === 422 || data.status === 404) {
        	Flash.create('danger', data.data.message);
        	$scope.model.auth_token = false;
        } else {
  	      $scope.model.userInfo = data.data;
        }
      });
  	};

  	$scope.phoneType = function(type) {
  		return "TestType"
  	};
});
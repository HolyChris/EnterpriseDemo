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

  	// Mocked data should be removed

	  $scope.model.userInfo = {
		  "project": {
		    "po_number": 50002,
		    "stage": "production",
		    "contract_signed_date": "2014-11-10",
		    "material_delivery_date": "2015-02-13",
		    "production_date": "2015-04-21",
		    "roof_completion_date": "2015-04-22",
		    "production_inspection_date": "2015-04-22"
		  },
		  "customer": {
		    "firstname": "Marianne",
		    "lastname": "Long",
		    "email": "jkjlj@aol.com",
		    "spouse": "",
		    "business_name": "",
		    "other_business_info": "",
		    "phone_numbers": [
		      {
		        "number": "303-693-7800 HM",
		        "primary": true,
		        "num_type": 2
		      },
		      {
		        "number": "720-552-0967",
		        "primary": false,
		        "num_type": 3
		      }
		    ]
		  },
		  "site": {
		    "name": "Home",
		    "managers": [
		      {
		        "id": 44,
		        "email": "cjackson@ecoroofandsolar.com",
		        "firstname": "Chuck",
		        "lastname": "Jackson"
		      }
		    ],
		    "address": {
		      "address1": "17633 E. Brunswick Pl",
		      "address2": null,
		      "city": "Aurora",
		      "zipcode": "80013",
		      "state": "Colorado"
		    }
		  }
		};
});
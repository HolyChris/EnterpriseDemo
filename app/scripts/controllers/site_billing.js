angular.module('ersApp')
  .controller('BillingCtrl', function($scope, $location, $anchorScroll, $stateParams, Billing) {

    $scope.format = "yyyy-MM-dd";
    $scope.location = {};
    $scope.insurance = {};
    $scope.site = {};
    $scope.opened = [];
    $scope.enableBilling = false;

    var globalData = $scope.$parent.globalData;
    globalData.$promise.then(function() {
      $scope.enableBilling = $scope.$parent.enableBilling;
    });

    Billing.query({siteId: $stateParams.projectId}, function(data) {
      $scope.site = data.site;
      if (data.site.billing) {
        $scope.location = data.site.billing;
        $scope.insurance = data.site.billing;
        $scope.billExist = true;
      } else {
        $scope.billExist = false;
      }
    });

    // Takes an ISO date formated string
    // and returns YYY-MM-DD
    function toDate(string) {
      if (string) {
        var date = new Date(Date.parse(string));
        string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      }
      return string;
    }

    $scope.updateLocation = function () {
      var params =  angular.copy($scope.location);
      angular.forEach(params, function(value, key) {
        if(key.indexOf("_date") !== -1 || key.indexOf("_at") !== -1) {
          params[key] = toDate(params[key]);
        }
      });
      if (!$scope.billExist) {
        params.siteId = $stateParams.projectId;
        Billing.save(params, function(data) {
          $scope.location = data.billing;
          $scope.insurance = data.billing;
        }); 
      } else {
        params.siteId = $stateParams.projectId;
        params.billingId = $scope.location.id;

        delete params.id;

        Billing.update(params, function(data) {
          $scope.location = data.billing;
          $scope.insurance = data.billing;
          $scope.billExist = true;
        }); 
      };
    };

    $scope.openDate = function($event, instance) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened[instance] = true;
    };

    // Required to do hasbang to an element id
    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
    };

  });
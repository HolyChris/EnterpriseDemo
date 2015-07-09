angular.module('ersApp')
  .controller('BillingCtrl', function($scope, $stateParams, Billing) {

    $scope.location = {};
    $scope.insurance = {};
    $scope.opened = [];

    Billing.query({siteId: $stateParams.projectId}, function(data) {
      if (data.site.billing) {
        $scope.location = data.site.billing;
        $scope.insurance = data.site.billing;
        $scope.billExist = true;
      } else {
        $scope.billExist = false;
      }
    });

    $scope.updateLocation = function () {
      if (!$scope.billExist) {
        var params =  angular.copy($scope.location);
        params.siteId = $stateParams.projectId;

        Billing.save(params, function(data) {
          $scope.location = data.billing;
          $scope.insurance = data.billing;
        }); 
      } else {
        var params =  angular.copy($scope.location);
        params.siteId = $stateParams.projectId;
        params.billingId = $scope.location.id;

        delete params.id;

        Billing.update(params, function(data) {
          console.log(data);
          $scope.location = data.billing;
          $scope.insurance = data.billing;
        }); 
      };
    };

    $scope.openDate = function($event, instance) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened[instance] = true;
    };
  });
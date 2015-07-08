angular.module('ersApp')
  .controller('BillingCtrl', function($scope, $stateParams, Billing) {

    $scope.location = {};
    $scope.insurance = {};
    $scope.opened = [];


    Billing.query({siteId: $stateParams.projectId}, function(data) {
      $scope.location = data.site.billing;
      $scope.insurance = data.site.billing;
    });

    $scope.updateLocation = function () {

      console.log("Save", $scope.location)

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
    $scope.openDate = function($event, instance) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened[instance] = true;
    }
  });
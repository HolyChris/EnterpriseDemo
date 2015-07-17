angular.module("ersApp")
  .controller("headerCtrl", function($scope, $state, $auth) {
    
    $scope.user = {};
    $scope.user.email = $auth.getEmail();

    $scope.searchSites = function() {
      if ($scope['contract_po_number_equals']) {
        $state.go('sites', {'contract_po_number_equals': $scope['contract_po_number_equals']});
      }
    };
  });
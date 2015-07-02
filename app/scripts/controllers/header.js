angular.module("ersApp")
  .controller("headerCtrl", function($scope, $state, $auth) {
    
    $scope.user = {};
    $scope.user.email = $auth.getEmail();

    $scope.searchSites = function() {
      if ($scope['contract_po_number_contains']) {
        $state.go('sites', {'contract_po_number_contains': $scope['contract_po_number_contains']});
      }
    };
  });
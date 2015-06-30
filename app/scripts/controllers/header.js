angular.module("ersApp")
  .controller("headerCtrl", function($scope, $state) {
    $scope.searchSites = function() {
      if ($scope['contract_po_number_equals']) {
        $state.go('sites', {'contract_po_number_equals': $scope['contract_po_number_equals']});
      }
    }
  });
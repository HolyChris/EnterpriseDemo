angular.module('ersApp')
    .controller('InsuranceAdjustorPortalCtrl', function ($scope, $location, $stateParams, $rootScope, $http, Flash, ENV) {
        $rootScope.hideNavigationItems = true;

        $scope.loading = true;
        $http.get(ENV.apiEndpoint + '/api/v1/adjustor_portal?token=' + $stateParams.token).then(function(response) {
            $scope.loading = false;
            $scope.model = response.data;
        });
    });

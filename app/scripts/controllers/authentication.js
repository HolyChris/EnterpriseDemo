angular.module('ersApp')
    .controller('LoginCtrl', function ($scope, $stateParams, $http, $auth, $location, $rootScope, Flash, ENV) {
        $rootScope.isAuthenticated = false;

        $scope.signUp = function () {
            if ($scope.loading)
                return;

            $auth.logout();
            if (!$scope.model) {
                Flash.create('danger', 'Please provide Email and Password');
                return;
            }

            $scope.loading = true;
            $auth.login({
                email: $scope.model.email,
                password: $scope.model.password
            })
            .then(function (response) {
                $scope.loading = false;
                if (response.data.message) {
                    Flash.create('danger', response.data.message);
                } else {
                    $rootScope.userEmail = response.data.email;
                    $location.path("/");
                }
            })
            .catch(function (response) {
                // API doesn't return proper validation messages
                // so I'm unable to highlight the input here
                $scope.loading = false;
                Flash.create('danger', response.data.message);
            });
        };

        $scope.showResetForm = function () {
            $scope.resetPassword = true;
            $scope.model.resetemail = '';
        };
        $scope.showLoginForm = function () {
            $scope.resetPassword = false;
        };

        $scope.sendResetPassword = function () {
            $scope.loadingReset = true;
            // call api for sending reset instructions here
            $http.post(ENV.apiEndpoint + "/api/v1/users/password?email=" + $scope.model.resetemail).success(function (data) {
                $scope.loadingReset = false;
                Flash.create('success', data.message);
                $scope.resetPassword = false;
            }).error(function (error) {
                $scope.loadingReset = false;
                Flash.create('danger', error.message);
            })
        };

    })
    .controller('LogoutCtrl', function ($scope, $auth, $location, $state, $http, ENV, $rootScope) {
        // first delete token from server, do it before .logout() so it sends
        // auth headers for this api
        $rootScope.isAuthenticated = false;
        $http.delete(ENV.apiEndpoint + "/api/v1/sign_out").success(function () {
            $auth.logout()
                .then(function () {
                    $location.path('/login')
                })
                .catch(function (response) {
                    // console.log("Error", response);
                });
        });
    });


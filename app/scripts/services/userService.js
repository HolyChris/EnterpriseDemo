var userService = angular.module('usersService', ['ngResource']);

userService.factory('User', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/users/:userId', {userid: '@id'}, {
    save: {
      method: 'PUT'
    }
  });
});
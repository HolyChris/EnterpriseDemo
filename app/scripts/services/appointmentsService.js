var appointmentsService = angular.module('appointmentsService', ['ngResource']);

appointmentsService.factory('Appointment', function($resource, ENV) {
  return $resource(ENV.apiEndpoint + '/api/v1/appointments/:id', {id: '@id'}, {
    query: {method: "GET", isArray: false},
    save: {
      method: "PUT"
    },
    create: {
      method: "POST"
    }
  });
});

var appointmentsService = angular.module('appointmentsService', ['ngResource']);

appointmentsService.factory('Appointment', function($resource, ENV) {
	var resource=$resource(ENV.apiEndpoint + '/api/v1/appointments/:id', {id: '@id'}, {
		    query: {method: "GET", isArray: false},
		    save: {
		      method: "PUT"
		    },
		    create: {
		      method: "POST"
		    }
		  });

	var outcomes=[
		'Vendor Packet',
		'Meet and Greet',
		'Demo - No Sale',
		'No Demo - No Need', 
		'No Demo - Future Need',
		'No Show', 
		'No Entry', 
		'SOLD', 
		'Gaco Bid', 
		'Rescheduled', 
		'Wrong Address'];

	return {
		resource: resource,
		outcomes: outcomes
	};
	
});

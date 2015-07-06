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

	var addNewFollowUpToAppointment=function(appointment,followup,successFunction, errorFunction)
	{
		var followUpsAttributes={
			"follow_ups_attributes":
				{"0" : followup}
	    };
		resource.save({id: appointment.id},followUpsAttributes,successFunction,errorFunction);
	}

	var updateFollowUp=function(appointment,followup,successFunction, errorFunction){
		var followUpsAttributes={
			"follow_ups_attributes":
				{"0" : followup}	        
	    };

	    //TODO some validations could be included here
    	resource.save({id: appointment.id},followUpsAttributes,successFunction,errorFunction);	
	    
	}

	var removeFollowUp=function(appointment,followup,successFunction, errorFunction){

		var followUpsAttributes={
			"follow_ups_attributes":
				{"0" : 
					{
						id: followup.id,
						"_destroy" : "1"
					}
				}
	    };

	    //TODO some validations could be included here
    	resource.save({id: appointment.id},followUpsAttributes,successFunction,errorFunction);	
	    
	}

	return {
		resource: resource,
		outcomes: outcomes,
		addNewFollowUpToAppointment: addNewFollowUpToAppointment,
		updateFollowUp: updateFollowUp,
		removeFollowUp: removeFollowUp
	};
	
});

'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AppointmentsCtrl
 * @description
 * # AppointmentsCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AppointmentsCtrl', function($scope, $rootScope,$stateParams, Appointment, Flash, Overview, Managers) {

	//Here we find out if the url is passing a siteId
	if ($stateParams.projectId) {
		Overview.query({siteId: $stateParams.projectId}, function(data) {
	      $scope.project = data.site;
	      $rootScope.project_id=$scope.project.id;

	      prepareAppointmentsView($scope.project.appointments);
	      
	    });
	}

	function clearErrors()
	{
		$scope.errors={};
        Flash.dismiss();
	}

	function prepareAppointmentsView(appointments)
	{
		angular.forEach(appointments, function(appointment, key) {
			appointment.scheduled_at=new Date(appointment.scheduled_at);
     	});
	}

	function prepareAppointment(appointment,index)
	{
		$scope.project.appointments[index]=appointment;
		appointment.scheduled_at=new Date(appointment.scheduled_at);
	}

	$scope.enable_appointment_edition=function(appointment)
	{
		appointment.edition_enabled=true;
	}

	$scope.cancel_appointment_edition=function(appointment,index)
	{
		if (appointment.isNew)
		{
			//We have to remove it from array
			$scope.project.appointments.splice(index,1);
		}
		else
		{
			appointment.edition_enabled=false;	
		}
		
	}


	$scope.save_appointment=function(appointment,index)
	{
		if (appointment.assigned_to)
		{
			//This means that a mail got selected, we fill the attribute value 
			//that API's expecting
			appointment.user_id=appointment.assigned_to.id;
		}

		if (appointment.isNew)
		{

			Appointment.resource.create({}, appointment, function(data) {

				//TODO Not sure why request returns a 422 error but ends up in success function
				if (data.errors){
					$scope.errors = data.errors;
	          		Flash.create('danger', 'Something happened. See errors below.');
				}
				else{
					Flash.create('success', 'Appointment was successfully saved!');
					prepareAppointment(data.appointment,index);
					$scope.customer_info_edition_enabled=false;
					clearErrors();
				}
				
	        }, function(error) {
	          $scope.errors = error.data.errors;
	          Flash.create('danger', 'Something happened. See errors below.');
	        });

			
		}
		else
		{
			//TODO Solve issue with outcome that gets returned as string but should be passed in as number second save sends the string
			Appointment.resource.save({id: appointment.id}, appointment, function(data) {

				Flash.create('success', 'Appointment was successfully saved!');
				prepareAppointment(data.appointment,index);
				$scope.customer_info_edition_enabled=false;
				clearErrors();
				
	        }, function(error) {
	          $scope.errors = error.data.errors;
	          Flash.create('danger', 'Something happened. See errors below.');
	        });
		}
	}

	$scope.add_appointment=function (project)
	{
		var new_appointment={site_id: project.id,isNew: true,edition_enabled: true};
		$scope.project.appointments.unshift(new_appointment);
	}

	$scope.delete_appointment=function(appointment){
		Appointment.resource.delete({id: appointment.id}, appointment, function(data) {
			//TODO Not sure why request returns a 422 error but ends up in success function
			if (data.errors){
				$scope.errors = data.errors;
	      		Flash.create('danger', 'Something happened. See errors below.');
			}
			else{
				Flash.create('success', 'Appointment was successfully saved!');
				prepareAppointment(data.appointment,index);
				$scope.customer_info_edition_enabled=false;
				clearErrors();
			}
			
	    }, function(error) {
	      $scope.errors = error.data.errors;
	      Flash.create('danger', 'Appointment could not be deleted. Something happened.');
	    });
	}


	$scope.enable_followup_edition=function(followup){
		followup.edition_enabled=true;
	}

	$scope.cancel_followup_edition=function(appointment,followup,index){
		if (followup.isNew)
		{
			//We have to remove it from array
			appointment.follow_ups.splice(index,1);
		}
		else
		{
			followup.edition_enabled=false;	
		}
	}

	$scope.save_followup=function(followup){

	}

	$scope.add_followup=function(appointment){
		appointment.follow_ups.unshift({isNew: true,edition_enabled: true})
	}

	$scope.remove_followup=function(appointment,followup,$index){

	}

	$scope.outcomes_arr=Appointment.outcomes;
	
	$scope.managersArray = Managers.query();
	
});

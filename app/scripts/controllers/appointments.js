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

	function prepareAppointmentsView(appointments)
	{
		angular.forEach(appointments, function(appointment, key) {
			appointment.scheduled_at=new Date(appointment.scheduled_at);
     	});
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

	$scope.save_appointment=function(appointment)
	{
		if (appointment.isNew)
		{
			//Appointment.create
		}
		else
		{
			//Appointment.save
		}
	}

	$scope.add_appointment=function ()
	{
		$scope.project.appointments.unshift({isNew: true,edition_enabled: true})
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

	$scope.outcomes_arr=[
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

});

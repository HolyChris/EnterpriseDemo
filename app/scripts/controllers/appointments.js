'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:AppointmentsCtrl
 * @description
 * # AppointmentsCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('AppointmentsCtrl', function($scope, $rootScope,$stateParams,  Flash, Overview, Managers) {

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

	$scope.enable_edition=function(appointment)
	{
		appointment.edition_enabled=true;
	}

	$scope.cancel_edition=function(appointment,index)
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

	$scope.add_appointment=function ()
	{
		$scope.project.appointments.unshift({isNew: true,edition_enabled: true})
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

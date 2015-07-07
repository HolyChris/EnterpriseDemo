'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('ProjectCtrl', function($scope, $rootScope,$stateParams, Flash,Project) {

	$scope.colors_arr=Project.Colors;
	$scope.priorities_arr=Project.Priorities;

	//Here we find out if the url is passing a siteId
	if ($stateParams.projectId) {

		Project.getProjectDetailFromSite($stateParams.projectId,
			function(data){
				prepareProjectForView(data.project);
				$scope.project = data.project;
				$scope.site = $scope.project.site;
				$scope.job_submission = $scope.project.job_submission;
				$scope.insurance_and_mortgage_info=$scope.project.insurance_and_mortgage_info;

				$rootScope.project_id=$scope.site.id;
			},
			function(data){
				Flash.create('danger', 'Project could not be queried.');
			});
	    
	}

	function removeMonetarySignCharacter(monetaryValue)
	{
		return monetaryValue.substring(1);
	}

	function prepareProjectForView(project)
	{

		//API returns amount with dollar sign
		project.insurance_and_mortgage_info.deductible=removeMonetarySignCharacter(project.insurance_and_mortgage_info.deductible);

		//WE have to convert string dates to proper dates
		project.hoa_approval_date=new Date(project.hoa_approval_date);
		project.last_roof_built_date=new Date(project.last_roof_built_date);

		//API returns priority description but expects id
		project.priority=$scope.priorities_arr.indexOf(project.priority) +1;

		prepareJobSubmissionForView(project.job_submission);
	}

	function prepareJobSubmissionForView(job_submission)
	{
		//API RETURNS description of color, but expects id
		job_submission.shingle_color=$scope.colors_arr.indexOf(job_submission.shingle_color) +1;
		job_submission.drip_color=$scope.colors_arr.indexOf(job_submission.drip_color) +1;

		//API returns amount with dollar sign
		job_submission.initial_cost_per_sq=removeMonetarySignCharacter(job_submission.initial_cost_per_sq);
		job_submission.roof_work_acv=removeMonetarySignCharacter(job_submission.roof_work_acv);
		job_submission.roof_work_rcv=removeMonetarySignCharacter(job_submission.roof_work_rcv);

		job_submission.gutters_rcv=removeMonetarySignCharacter(job_submission.gutters_rcv);
		job_submission.gutters_acv=removeMonetarySignCharacter(job_submission.gutters_acv);
		job_submission.gutters_upgrade_cost=removeMonetarySignCharacter(job_submission.gutters_upgrade_cost);
		job_submission.gutters_discount=removeMonetarySignCharacter(job_submission.gutters_discount);
		job_submission.gutters_total=removeMonetarySignCharacter(job_submission.gutters_total);

		
		job_submission.siding_rcv=removeMonetarySignCharacter(job_submission.siding_rcv);
		job_submission.siding_acv=removeMonetarySignCharacter(job_submission.siding_acv);
		job_submission.siding_upgrade_cost=removeMonetarySignCharacter(job_submission.siding_upgrade_cost);
		job_submission.siding_discount=removeMonetarySignCharacter(job_submission.siding_discount);
		job_submission.siding_total=removeMonetarySignCharacter(job_submission.siding_total);

		job_submission.windows_rcv=removeMonetarySignCharacter(job_submission.windows_rcv);
		job_submission.windows_acv=removeMonetarySignCharacter(job_submission.windows_acv);
		job_submission.windows_upgrade_cost=removeMonetarySignCharacter(job_submission.windows_upgrade_cost);
		job_submission.windows_discount=removeMonetarySignCharacter(job_submission.windows_discount);
		job_submission.windows_total=removeMonetarySignCharacter(job_submission.windows_total);

		job_submission.paint_rcv=removeMonetarySignCharacter(job_submission.paint_rcv);
		job_submission.paint_acv=removeMonetarySignCharacter(job_submission.paint_acv);
		job_submission.paint_upgrade_cost=removeMonetarySignCharacter(job_submission.paint_upgrade_cost);
		job_submission.paint_discount=removeMonetarySignCharacter(job_submission.paint_discount);
		job_submission.paint_total=removeMonetarySignCharacter(job_submission.paint_total);

		job_submission.hvac_rcv=removeMonetarySignCharacter(job_submission.hvac_rcv);
		job_submission.hvac_acv=removeMonetarySignCharacter(job_submission.hvac_acv);
		job_submission.hvac_upgrade_cost=removeMonetarySignCharacter(job_submission.hvac_upgrade_cost);
		job_submission.hvac_discount=removeMonetarySignCharacter(job_submission.hvac_discount);
		job_submission.hvac_total=removeMonetarySignCharacter(job_submission.hvac_total);
	}

	$scope.enable_project_edition=function(){
		$scope.project.edition_enabled=true;
	}
	$scope.save_project=function(){}
	$scope.cancel_project_edition=function(){
		$scope.project.edition_enabled=false;
	}
	$scope.enable_insurance_and_mortgage_info_edition=function(){
		$scope.insurance_and_mortgage_info.edition_enabled=true;
	}
	$scope.save_insurance_and_mortgage_info=function(){}
	$scope.cancel_insurance_and_mortgage_info_edition=function(){
		$scope.insurance_and_mortgage_info.edition_enabled=false;
	}
	$scope.enable_job_submission_edition=function(){
		$scope.job_submission.edition_enabled=true;
	}
	$scope.save_job_submission=function(){}
	$scope.cancel_job_submission_edition=function(){
		$scope.job_submission.edition_enabled=false;
	}
	
});

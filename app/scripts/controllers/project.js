'use strict';

/**
 * @ngdoc function
 * @name ersApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the ersApp
 */
angular.module('ersApp')
  .controller('ProjectCtrl', function($scope, $rootScope, $stateParams, $http, $location, $anchorScroll, Flash, Project, ENV) {

  	$scope.format = "yyyy-MM-dd";
  	$scope.opened = [];
  	
	$scope.colors_arr=Project.Colors;
	$scope.priorities_arr=Project.Priorities;
	$scope.site = {};
	$scope.manufacturers_arr=Project.Manufacturers;
	$scope.shingles_arr=Project.Shingles;
	

	$scope.sendCustomerPortalEmail = function() {
		$http.get(ENV.apiEndpoint + "/api/v1/sites/"+ $scope.site.id +"/contract/send_to_customer").success(function(response) {
			Flash.create('success', "Email sent to customer");
		}).error(function(data) {
				Flash.create('danger', data.message);
		});

	};

	//Here we find out if the url is passing a siteId
	if ($stateParams.projectId) {

		Project.getProjectDetailFromSite($stateParams.projectId,
			function(data){
				$scope.site = data.project.site;
				$scope.customer = data.project.customer;
				prepareProjectForView(data.project);
				$rootScope.project_id=data.project.site.id;

			},
			function(data){
				Flash.create('danger', 'Project could not be queried.');
			});
	    
	}

	function fillEditableReferencesFromApi(project)
	{
		

		//The project reference will be used to modify only base project attributes
		//that's why we delete the related inner objects to prevent these from being sent to API PUT request
		$scope.project = angular.copy(project);
		delete $scope.project.job_submission;
		delete $scope.project.insurance_and_mortgage_info;

		$scope.job_submission = angular.copy(project.job_submission);
		$scope.insurance_and_mortgage_info= angular.copy(project.insurance_and_mortgage_info);		

		return {
			project : $scope.project,
			job_submission: $scope.job_submission,
			insurance_and_mortgage_info: $scope.insurance_and_mortgage_info
		};
	};

	function formatCurrencyForView(currencyValue)
	{
		var formattedCurrencyForView=currencyValue;
		if (currencyValue){

			//First remove currency sign
			formattedCurrencyForView=currencyValue.substring(1);

			//Convert it to a float
			formattedCurrencyForView = parseFloat(formattedCurrencyForView.replace(/\,/g, ''));
		}

		return formattedCurrencyForView;
	};

	function prepareProjectForView(project)
	{
		clearErrors();
		
		//First we backup the project data from API as is
		$scope.project_from_api=project;

		//Now create the editable object copies with additional transformations for the view		
		var editableSections=fillEditableReferencesFromApi(project);

		//WE have to convert string dates to proper dates
		if (editableSections.project.hoa_approval_date){
			editableSections.project.hoa_approval_date=new Date(editableSections.project.hoa_approval_date);
		}

		if (editableSections.project.last_roof_built_date){
			editableSections.project.last_roof_built_date=new Date(editableSections.project.last_roof_built_date);	
		}
		
		//API returns priority description but expects id
		editableSections.project.priority=$scope.priorities_arr.indexOf(editableSections.project.priority) +1;

		prepareInsuranceAndMortgageInfoForView(editableSections.insurance_and_mortgage_info);
		prepareJobSubmissionForView(editableSections.job_submission);
		
	};

	function prepareInsuranceAndMortgageInfoForView(insurance_and_mortgage_info)
	{
		if (insurance_and_mortgage_info){
			//API returns amount with dollar sign
			insurance_and_mortgage_info.deductible=formatCurrencyForView(insurance_and_mortgage_info.deductible);
		}
	}

	function prepareJobSubmissionForView(job_submission)
	{
		if (job_submission){
			

			if (job_submission.shingle_manufacturer){
				angular.forEach($scope.manufacturers_arr, function(value, key) {
			      if (value.name==job_submission.shingle_manufacturer) {
			        job_submission.shingle_manufacturer = value.id;
			      }
			    });
			}

			if (job_submission.shingle_type){
				angular.forEach($scope.shingles_arr, function(value, key) {
			      if (value.title==job_submission.shingle_type) {
			        job_submission.shingle_type = value.id;
			      }
			    });
			}

			//API RETURNS description of color, but expects id

			if (job_submission.shingle_color){
				angular.forEach($scope.colors_arr, function(value, key) {
			      if (value.name==job_submission.shingle_color) {
			        job_submission.shingle_color = value.id;
			      }
			    });
			}

			if (job_submission.drip_color){
				angular.forEach($scope.colors_arr, function(value, key) {
			      if (value.name==job_submission.drip_color) {
			        job_submission.drip_color = value.id;
			      }
			    });
			}

			//API returns amount with dollar sign
			job_submission.initial_cost_per_sq=formatCurrencyForView(job_submission.initial_cost_per_sq);
			job_submission.roof_work_acv=formatCurrencyForView(job_submission.roof_work_acv);
			job_submission.roof_work_rcv=formatCurrencyForView(job_submission.roof_work_rcv);
			job_submission.roof_upgrade_cost=formatCurrencyForView(job_submission.roof_upgrade_cost);
			job_submission.roof_discount=formatCurrencyForView(job_submission.roof_discount);
			
			

			job_submission.gutters_rcv=formatCurrencyForView(job_submission.gutters_rcv);
			job_submission.gutters_acv=formatCurrencyForView(job_submission.gutters_acv);
			job_submission.gutters_upgrade_cost=formatCurrencyForView(job_submission.gutters_upgrade_cost);
			job_submission.gutters_discount=formatCurrencyForView(job_submission.gutters_discount);
			job_submission.gutters_total=formatCurrencyForView(job_submission.gutters_total);

			
			job_submission.siding_rcv=formatCurrencyForView(job_submission.siding_rcv);
			job_submission.siding_acv=formatCurrencyForView(job_submission.siding_acv);
			job_submission.siding_upgrade_cost=formatCurrencyForView(job_submission.siding_upgrade_cost);
			job_submission.siding_discount=formatCurrencyForView(job_submission.siding_discount);
			job_submission.siding_total=formatCurrencyForView(job_submission.siding_total);

			job_submission.windows_rcv=formatCurrencyForView(job_submission.windows_rcv);
			job_submission.windows_acv=formatCurrencyForView(job_submission.windows_acv);
			job_submission.windows_upgrade_cost=formatCurrencyForView(job_submission.windows_upgrade_cost);
			job_submission.windows_discount=formatCurrencyForView(job_submission.windows_discount);
			job_submission.windows_total=formatCurrencyForView(job_submission.windows_total);

			job_submission.paint_rcv=formatCurrencyForView(job_submission.paint_rcv);
			job_submission.paint_acv=formatCurrencyForView(job_submission.paint_acv);
			job_submission.paint_upgrade_cost=formatCurrencyForView(job_submission.paint_upgrade_cost);
			job_submission.paint_discount=formatCurrencyForView(job_submission.paint_discount);
			job_submission.paint_total=formatCurrencyForView(job_submission.paint_total);

			job_submission.hvac_rcv=formatCurrencyForView(job_submission.hvac_rcv);
			job_submission.hvac_acv=formatCurrencyForView(job_submission.hvac_acv);
			job_submission.hvac_upgrade_cost=formatCurrencyForView(job_submission.hvac_upgrade_cost);
			job_submission.hvac_discount=formatCurrencyForView(job_submission.hvac_discount);
			job_submission.hvac_total=formatCurrencyForView(job_submission.hvac_total);
		}

		
	};

	$scope.enable_project_edition=function(){
		$scope.project.edition_enabled=true;
	};

	$scope.save_project=function(){
		Project.updateProjectDetails($scope.site.id,$scope.project,function(data) {

			if (!data.errors)
			{
				Flash.create('success', 'Project was successfully saved!');
				prepareProjectForView(data.project);
				$scope.project.edition_enabled=false;
				$scope.$parent.refreshNavStatus();
			}
			else
			{
				$scope.errors = data.errors;
          		Flash.create('danger', 'Something happened. See errors below.');
			}
			
        }, function(error) {
          $scope.errors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        });
	};

	$scope.cancel_project_edition=function(){
		$scope.project.edition_enabled=false;
		prepareProjectForView($scope.project_from_api);
	};

	$scope.enable_insurance_and_mortgage_info_edition=function(){
		if (!$scope.insurance_and_mortgage_info)
		{
			//Queried project did not have this object defined
			//we define an empty object
			$scope.insurance_and_mortgage_info={};
		}
		$scope.insurance_and_mortgage_info.edition_enabled=true;
	};

	$scope.save_insurance_and_mortgage_info=function(){
		Project.updateInsuranceAndMortgageInfo($scope.site.id,$scope.project.id,$scope.insurance_and_mortgage_info,function(data) {

			if (!data.errors){
				Flash.create('success', 'Project was successfully saved!');
				prepareProjectForView(data.project);
				$scope.insurance_and_mortgage_info.edition_enabled=false;	
				$scope.$parent.refreshNavStatus();
			}
			else
			{
				$scope.errors = data.errors;
          		Flash.create('danger', 'Something happened. See errors below.');
			}
			
			
        }, function(error) {
          $scope.errors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        });
	};
	$scope.cancel_insurance_and_mortgage_info_edition=function(){
		$scope.insurance_and_mortgage_info.edition_enabled=false;
		prepareProjectForView($scope.project_from_api);
	};

	$scope.enable_job_submission_edition=function(){
		if (!$scope.job_submission)
		{
			//Queried project did not have this object defined
			//we define an empty object
			$scope.job_submission={};
		}
		$scope.job_submission.edition_enabled=true;
	};

	$scope.save_job_submission=function(){
		Project.updateJobSubmission($scope.site.id,$scope.project.id,$scope.job_submission,function(data) {

			Flash.create('success', 'Project was successfully saved!');
			prepareProjectForView(data.project);
			$scope.job_submission.edition_enabled=false;
			$scope.$parent.refreshNavStatus();
			
        }, function(error) {
          $scope.errors = error.data.errors;
          Flash.create('danger', 'Something happened. See errors below.');
        });
	};

	$scope.cancel_job_submission_edition=function(){
		$scope.job_submission.edition_enabled=false;
		prepareProjectForView($scope.project_from_api);
	};

	function clearErrors(){
		$scope.errors={};
	}

  // Required to do hasbang to an element id
  $scope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };

  $scope.openDate = function($event, instance) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened[instance] = true;
    };

});

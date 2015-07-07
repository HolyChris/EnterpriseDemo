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

	$scope.colors_arr=Project.colors;

	//Here we find out if the url is passing a siteId
	if ($stateParams.projectId) {
		
		

		Project.getProjectDetailFromSite($stateParams.projectId,
			function(data){
				$scope.project = data.project;
				$scope.site = $scope.project.site;

				$rootScope.project_id=$scope.site.id;
			},
			function(data){
				Flash.create('danger', 'Project could not be queried.');
			});
	    
	}
});

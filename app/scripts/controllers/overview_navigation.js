angular.module('ersApp')
  .controller('OverviewNavigationCtrl', function($stateParams, $scope, $state,Flash,Sites){

    $scope.project_id = $stateParams.projectId;
    $scope.globalData = {};
    $scope.site = {};
    $scope.enableProjectDetails = true;
    $scope.enableProduction = true;
    $scope.enableBilling = true;
    $scope.editStageMode = false;
    $scope.stagesList = [
      {
        value: "Under Contract",
        label: "Under Contract",
      }, {
        value: "Production",
        label: "Production",
      }, {
        value: "Billing",
        label: "Billing",
      }
    ];

    $scope.updateStage = function() {
      // need to convert to values accepted by backend ...
      var hash = {
        'Under Contract': 'contract',
        'Production': 'production',
        'Billing': 'billing'
      };

      if ($scope.site.stage === 'Opportunity'){
      //When in this stage we don't do transitions, we rather redirect user to contract filling page
      //User is trying to transition to another stage before even filling a contract
        if ($scope.site.new_stage != 'Under Contract'){
          Flash.create('warning', 'It is not possible to transition to other stages before filling a contract.');
        }

        $scope.site.new_stage=$scope.site.stage;
        $scope.disableStageEdition();
        $state.go("project.contract",{projectId: $scope.site.id});
      }
      else
      {
          Sites.save({
            siteId: $scope.project_id,
            current_stage: hash[$scope.site.new_stage]
            }, function() {
              $scope.disableStageEdition();
            });
      }
      
      
    };

    $scope.enableStageEdition = function() {
      $scope.editStageMode = true;
    };

    $scope.disableStageEdition = function() {
      $scope.editStageMode = false;
    };

    $scope.refreshNavStatus = function () {
      $scope.globalData = Sites.get({siteId: $stateParams.projectId}, function(data) {
        $scope.setNavStatus(data.site);
        $scope.site = data.site;
      });
    };

    $scope.setNavStatus = function (site) {
      if (site.stage === "Opportunity") {
        // No Contract yet
        $scope.enableProjectDetails = false;
        $scope.enableProduction = false;
        $scope.enableBilling = false;
      }
    };

    $scope.refreshNavStatus();
  })
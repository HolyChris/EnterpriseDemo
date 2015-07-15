angular.module('ersApp')
  .controller('ProductionCtrl', function($scope, $location, $anchorScroll, $stateParams, Production) {

    $scope.format = "yyyy-MM-dd";
    $scope.production = {};
    $scope.site = {};
    $scope.opened = [];
    $scope.editMode = false;
    $scope.enableProduction = false;

    var globalData = $scope.$parent.globalData;
    globalData.$promise.then(function() {
      $scope.enableProduction = $scope.$parent.enableProduction;
      if (globalData.site.production) {
        Production.query({siteId: globalData.site.id, productionId: globalData.site.production.id}, function(data) {
          $scope.site = $scope.$parent.globalData.site;
          if (data.production) {
            $scope.setProductionData(data);
          } else {
            $scope.productionExist = false;
          }
        });
        $scope.productionExist = false;
      }
    });

    // Takes an ISO date formated string
    // and returns YYY-MM-DD
    function toDate(string) {
      if (string) {
        var date = new Date(Date.parse(string));
        string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      }
      return string;
    }

    $scope.saveProduction = function () {
      var params =  angular.copy($scope.production);
      params.siteId = globalData.site.id;

      angular.forEach(params, function(value, key) {
        if(key.indexOf("_date") !== -1 || key.indexOf("_at") !== -1) {
          params[key] = toDate(params[key]);
        }
      });
      if (!$scope.productionExist) {
        Production.save(params, function(data) {
          $scope.setProductionData(data);
          $scope.$parent.refreshNavStatus();
        }); 
      } else {
        params.productionId = globalData.site.production.id;
        delete params.id;
        Production.update(params, function(data) {
          $scope.setProductionData(data);
          $scope.$parent.refreshNavStatus();
        }); 
      }

      $scope.disableEdition();
    };

    $scope.setProductionData = function(data) {
      $scope.previusProduction = angular.copy(data.production);
      $scope.production = data.production;
      $scope.productionExist = true;
    };

    $scope.enableEdition = function() {
      $scope.editMode = true;
    };

    $scope.disableEdition = function() {
      $scope.editMode = false;
    };

    $scope.discardChanges = function() {
      $scope.disableEdition();
      $scope.production = $scope.previusProduction;
    };

    $scope.openDate = function($event, instance) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened[instance] = true;
    };

    // Required to do hasbang to an element id
    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
    };

  });
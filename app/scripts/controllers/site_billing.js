angular.module('ersApp')
  .controller('BillingCtrl', function($scope, $location, $anchorScroll, $stateParams, Billing, Flash) {

    $scope.format = "yyyy-MM-dd";
    $scope.location = {};
    $scope.insurance = {};
    $scope.site = {};
    $scope.opened = [];
    $scope.editModeLocation = false;
    $scope.editModeInsurance = false;
    $scope.enableBilling = false;

    var globalData = $scope.$parent.globalData;
    globalData.$promise.then(function() {
      $scope.enableBilling = $scope.$parent.enableBilling;
    });

    Billing.query({siteId: $stateParams.projectId}, function(data) {
      $scope.site = data.site;
      if (data.site.billing) {
        $scope.billing = data.site.billing;
      } else {
        $scope.billExist = false;
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

    $scope.saveBilling = function () {
      var params =  angular.copy($scope.billing);
      angular.forEach(params, function(value, key) {
        if(key.indexOf("_date") !== -1 || key.indexOf("_at") !== -1) {
          params[key] = toDate(params[key]);
        }
      });
      if (!$scope.billExist) {
        params.siteId = $stateParams.projectId;
        Billing.save(params, function(data) {
          $scope.billing = data.billing;
          $scope.$parent.refreshNavStatus();
          $scope.editModeLocation = false;
          $scope.editModeInsurance = false;
          Flash.create('success', 'Billing information updated!');
        }); 
      } else {
        params.siteId = $stateParams.projectId;
        params.billingId = $scope.location.id;

        delete params.id;

        Billing.update(params, function(data) {
          $scope.billing = data.billing;
          $scope.billExist = true;
          $scope.$parent.refreshNavStatus();
          $scope.editModeLocation = false;
          $scope.editModeInsurance = false;
          Flash.create('success', 'Billing information updated!');
        }); 
      };
    };

    $scope.setProductionData = function(data) {
      $scope.previousBilling = angular.copy(data.billing);
      $scope.billing = data.billing;
      $scope.billExist = true;
    };

    $scope.enableEdition = function(section) {
      $scope.previousBilling = angular.copy($scope.billing);
      if (section === 'Location') {
        $scope.editModeLocation = true;
      } else if (section === 'Insurance') {
        $scope.editModeInsurance = true;
      }
    };

    $scope.disableEdition = function(section) {
      if (section === 'Location') {
        $scope.editModeLocation = false;
      } else if (section === 'Insurance') {
        $scope.editModeInsurance = false;
      }
    };

    $scope.discardChanges = function(section) {
      $scope.disableEdition(section);
      $scope.billing = $scope.previousBilling;
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
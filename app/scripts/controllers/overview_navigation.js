angular.module('ersApp')
    .controller('OverviewNavigationCtrl', function ($stateParams, $scope, $state, Flash, Sites, Lightbox, ENV, $http) {

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
            },
            {
                value: "Closed",
                label: "Closed",
            }
        ];

        $scope.updateStage = function () {
            // need to convert to values accepted by backend ...
            var hash = {
                'Under Contract': 'contract',
                'Production': 'production',
                'Billing': 'billing',
                'Closed': 'closed'
            };

            if ($scope.site.stage === 'Opportunity') {
                //When in this stage we don't do transitions, we rather redirect user to contract filling page
                //User is trying to transition to another stage before even filling a contract
                if ($scope.site.new_stage != 'Under Contract') {
                    Flash.create('warning', 'It is not possible to transition to other stages before filling a contract.');
                }

                $scope.site.new_stage = $scope.site.stage;
                $scope.disableStageEdition();
                $state.go("project.contract", {projectId: $scope.site.id});
            }
            else {
                Sites.save({
                    siteId: $scope.project_id,
                    current_stage: hash[$scope.site.new_stage]
                }, function (data) {
                    $scope.disableStageEdition();
                });
            }


        };

        $scope.enableStageEdition = function () {
            $scope.editStageMode = true;
        };

        $scope.disableStageEdition = function () {
            $scope.editStageMode = false;
        };

        $scope.refreshNavStatus = function () {
            $scope.globalData = Sites.get({siteId: $stateParams.projectId}, function (data) {
                $scope.setNavStatus(data.site);
                $scope.site = data.site;
                $scope.site.new_stage = $scope.site.stage;

                if(data.site.insurance_adjustor)
                    $scope.insuranceAdjustor.model = data.site.insurance_adjustor;
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

        $scope.uploadCoverPhoto = function (files) {
            if (files.length == 1) {
                //A file has been selected we prepare

                var fd = new FormData(); // prepare as form data to handle files.
                fd.append('id', $scope.site.id);
                fd.append('cover_photo', files[0]);

                Sites.upload_coverphoto({siteId: $scope.site.id}, fd, function (data) {
                        if (data.errors) {
                            Flash.create('danger', 'Something happened. Cover photo could not be uploaded.');

                        }
                        else {
                            Flash.create('success', 'Cover photo succesfully uploaded.');
                            $scope.site = data.site;
                        }
                    },
                    function (error) {
                        Flash.create('danger', 'Something happened. Cover photo could not be uploaded.');
                    });
            }
            else if (files.length > 1) {
                Flash.create('warning', 'Only one file can be selected as cover photo.');
            }
        };

        $scope.openCoverPhotoInLightboxModal = function () {
            var images = [{
                'url': $scope.site.cover_photo_url,
                'thumbUrl': $scope.site.cover_photo_url,
                'caption': 'Cover photo',
            }];

            Lightbox.openModal(images, 0);
        };


        /* Insurance adjustor */
        $scope.insuranceAdjustor = {
            model: {},
            edit: function() {
                $scope.insuranceAdjustor.editing = true;
            },
            save: function() {
                $scope.insuranceAdjustor.loading = true;
                var request = {
                    method: 'POST',
                    url: ENV.apiEndpoint + '/api/v1/sites/' + $stateParams.projectId + '/insurance_adjustors',
                    data: $scope.insuranceAdjustor.model
                };
                if($scope.insuranceAdjustor.model.id) {
                    request.method = 'PUT';
                    request.url += '/' + $scope.insuranceAdjustor.model.id;
                }
                $http(request).then(function(response) {
                    $scope.insuranceAdjustor.loading = false;
                    $scope.insuranceAdjustor.editing = false;
                });
            },
            cancel: function() {
                $scope.insuranceAdjustor.editing = false;
            }
        };

    })

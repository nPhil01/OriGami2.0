(function () {
	'use strict';

	angular
		.module('starter')
		.controller('GameCreationController', GameCreationController);

	GameCreationController.$inject = ['$scope', '$ionicHistory', '$ionicSlideBoxDelegate', '$ionicModal', 'MapService'];

	function GameCreationController ($scope, $ionicHistory, $ionicSlideBoxDelegate, $ionicModal, MapService) {
		var vm = this;
		vm.newgame = {}; //General description of the game
		vm.abort = abort;
		vm.invalidForm = true;
		vm.act_type = 0;
		vm.previousSlide = previousSlide;
		vm.nextSlide = nextSlide;
		vm.slideChanged = slideChanged;
		vm.showSlideButtons = showSlideButtons;
		vm.diff = Array.apply(null, Array(5)).map(function () {
        	return "ion-ios-star-outline"
    	});
    	vm.rateGame = rateGame;
    	vm.initSlideBox = initSlideBox;
		vm.submit = submit;
		vm.currentAct = {}; // Activity that is currently created
		vm.chooseActType = chooseActType;
		vm.finishGame = finishGame;
		vm.slideTitle = 'General Information';
		vm.mainMap = MapService;

		activate();

		////////////////////////////

		function activate () {
			
		}	

		function initSlideBox () {
			$ionicSlideBoxDelegate.enableSlide(false);
		}

		function submit (invalid) {
			vm.invalidForm = invalid;
		}

		function previousSlide () {
			$ionicSlideBoxDelegate.previous();
		}

		function nextSlide () {
			if ($ionicSlideBoxDelegate.currentIndex() === 1) {
				addActivity();
			}
			$ionicSlideBoxDelegate.next();
		}

		function slideChanged (slideIndex) {
			if (slideIndex === 0) {
				vm.slideTitle = 'General Information';
			}
			if (slideIndex === 1) {
				vm.slideTitle = 'Choose Activity Type';
				if (vm.act_type === 0) {
					submit(true);
				} else {
					submit(false);
				}
			}
			if (slideIndex === 2) {
				vm.slideTitle = 'Add points to the map';
			}
			if (slideIndex === 3) {
				vm.slideTitle = 'Congratulation!';	
			}
		}

		function showSlideButtons () {
			let currentIndex = $ionicSlideBoxDelegate.currentIndex();
			let slidesCount = $ionicSlideBoxDelegate.slidesCount();
			let showPrevious = false;
			let showNext = true;
			let saveButton = false;

			if (currentIndex === 0) {
				showPrevious = false;
			} else if (currentIndex > 0 && currentIndex < slidesCount - 2) {
				showPrevious = true;
			} else if (currentIndex === slidesCount - 2) {
				showPrevious = true;
				showNext = false;
				saveButton = true;
			} else if (currentIndex === slidesCount - 1) {
				showPrevious = false;
				showNext = false;
				saveButton = false;
			}

			return { 
				showPrevious: showPrevious, 
				showNext: showNext, 
				saveButton: saveButton 
			}
		}

		function rateGame (difficulty) {
			vm.diff = Array.apply(null, Array(5)).map(function () {
			    return "ion-ios-star-outline"
			});
			for (var i = 0; i <= difficulty; i++) {
			    vm.diff[i] = "ion-ios-star";
			}
			vm.newgame.difficulty = difficulty + 1;
		}

		function abort () {
			$ionicHistory.goBack();
		}

		//Choose Activity
		function chooseActType (type) {
		    if (type === vm.act_type) {
		        vm.act_type = 0;
		    	submit(true);
		    } else {
		        vm.act_type = type;
		        submit(false);
		    }
		}

	    function addActivity () {
	        vm.newgame.activities = [];
	        vm.currentAct.type = vm.act_type == 1 ? "Find destination" : "Follow route";
	        vm.currentAct.points = [];
	    }

	    function finishGame () {
	    	nextSlide();
	        // API.saveItem(vm.newgame)
	        //     .success(function (data, status, headers, config) {
	        //         // $rootScope.hide();
	        //         // $rootScope.doRefresh(1);
	        //         // $ionicHistory.goBack();
	        //         // $scope.newgame = {};
	        //     })
	        //     .error(function (data, status, headers, config) {
	        //         // $rootScope.hide();
	        //         // $rootScope.notify("Oops something went wrong!! Please try again later");
	        //         // $ionicHistory.goBack();
	        //         // $scope.newgame = {};
	        //         // $scope.numberTask = 0;
	        //     });
	    }

	    ////////////////////////////

	    //Add Waypoint with modal
	    $scope.$on('leafletDirectiveMap.click', function (event, locationEvent) {
	    	console.log('leaflet click');
	        $scope.newWaypoint = new Waypoint();
	        $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
	        $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
	        $scope.newWaypoint.tasks = [];

	        createModal('templates/map/waypoint.html', 'm1');
	    });

	    var Waypoint = function () {
	        if (!(this instanceof Waypoint)) return new Waypoint();
	        this.lat = "";
	        this.lng = "";
	        this.name = "";
	        this.tasks = [];
	    };

	    // Modal Windows Routine
	    var createModal = function (templateUrl, id) {
	        $ionicModal.fromTemplateUrl(templateUrl, {
	            id: id,
	            scope: $scope,
	            animation: 'slide-in-up',
	            backdropClickToClose: false
	        }).then(function (modal) {
	            $scope.modal = modal;
	            $scope.modal.show();
	        });
	    };

	    var newMarker = {};
	    $scope.numberTask = 0;
	    $scope.saveWayPoint = function () {
	        if (($scope.newWaypoint.name == "" || $scope.newWaypoint.name == undefined) || ($scope.newWaypoint.description == undefined || $scope.newWaypoint.description == "")) {

	            if ($scope.newWaypoint.name == "" || $scope.newWaypoint.name == undefined) {
	                $scope.name_border = "red";
	            } else {
	                $scope.name_border = "";
	            }

	            if ($scope.newWaypoint.description == undefined || $scope.newWaypoint.description == "") {
	                $scope.description_border = "red";
	            } else {
	                $scope.description_border = "";
	            }
	        } else {
	            $scope.name_border = "";
	            $scope.description_border = "";

	            newMarker = $scope.newWaypoint;
	            newMarker.icon = angular.copy(waypointIcon);
	            newMarker.icon.number = $scope.mainMap.markers.length + 1;
	            $scope.mainMap.markers.push($scope.newWaypoint);

	            $scope.closeModal();
	            createModal('templates/tasks/task_choose.html', 'm2');
	        }
	    };

	    var waypointIcon = {
			type: 'extraMarker',
			icon: 'fa-number',
			markerColor: 'blue',
			shape: 'circle',
			number: '1'
	    }

	    $scope.mainMap = {
	        center: {
	            autoDiscover: true,
	            zoom: 16
	        },
	        defaults: {
	            tileLayer: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	            maxZoom: 18,
	            zoomControlPosition: 'topleft',
	            lat: 57,
	            lng: 8
	        },
	        markers: [],
	        events: {},
	        layers: {
	            baselayers: {
	                osm: {
	                    name: 'Satelite View',
	                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	                    type: 'xyz',
	                    top: true,
	                    layerOptions: {
	                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	                        continuousWorld: false
	                    }
	                },
	                streets: {
	                    name: 'Streets View',
	                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	                    type: 'xyz',
	                    top: false,
	                },
	                topographic: {
	                    name: 'Topographic View',
	                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
	                    type: 'xyz',
	                    top: false,
	                    layerOptions: {
	                        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
	                        continuousWorld: false
	                    }
	                }
	            }
	        }
	    };

		$scope.closeModal = function () {
			$scope.modal.remove();
		};
	}
})();
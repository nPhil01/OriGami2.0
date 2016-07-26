angular.module('starter.controllers', ['starter.services', 'starter.directives'])

.controller('HomeCtrl', function ($scope) {})

.controller('GamesCtrl', function ($rootScope, $scope, $http, $location,
    $ionicModal, API, Data, $window, $timeout, $ionicPopup, $ionicHistory, $translate) {

    // Info Popups --------------------------------------
    $scope.showPathInfo = function () {
        var alertPopup = $ionicPopup.alert({
            title: $translate.instant('find_destination'),
            /* template: 'Navigators have to plan a path to reach the destination. They refer to the survey knowledge they already have available, combine it in new ways and possibly make inferences about missing pieces. Requires more cognitive effort.'*/
            template: $translate.instant('put_longer_tap')
        });
    };

    $scope.showAidInfo = function () {
        var alertPopup = $ionicPopup.alert({
            title: $translate.instant('follow_route'),
            template: $translate.instant('put_longer_tap')
                //template: 'Navigators follow a trail to the destination. Less cognitive effort.'
        });
    };
    //Get back in the history
    $scope.cancelGame = function () {
        $ionicHistory.goBack();
    };

    // Fetch all the games from the server
    $scope.games = [];
    API.getMetadata().success(function (metadata, status, headers, config) {
        $scope.error_msg = null;
        $scope.games = [];
        for (var i = 0; i < metadata.length; i++) {
            $scope.games.push(metadata[i]);
            $scope.games[i].diff = Array.apply(null, Array(metadata[i].diff)).map(function () {
                return "ion-ios-star"
            });
        }
    }).error(function (data, status, headers, config) {
        $scope.error_msg = $translate.instant('network_error');
        console.log("Could not fetch game metadata from server");
    });


    /*$scope.games = [];
    $scope.createFile = function () {
        API.getAll().success(function (data, status, headers, config) {
            $scope.games = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].name != null) {
                    $scope.games.push(data[i]);
                }
            }

            if ($scope.games.length == 0) {
                $scope.noData = true;
            } else {
                for (var i = 0; i < $scope.games.length; i++) {
                    var maxPoint = 0

                    if ($scope.games[i].players != undefined) {
                        for (var d = 0; d < $scope.games[i].players.length; d++) {
                            if ($scope.games[i].players[d].points > maxPoint) {
                                maxPoint = $scope.games[i].players[d].points;
                            }
                        }
                    }
                    $scope.games[i].maxp = maxPoint;

                    $scope.games[i].diff = Array.apply(null, Array($scope.games[i].difficulty)).map(function () {
                        return "ion-ios-star"
                    });
                }
                $scope.noData = false;
            }
            
            var metaData = {};
            metaData.name = "metadata";
            metaData.games = $scope.games;

            API.saveItem(metaData)
                .success(function (data, status, headers, config) {

                console.log(data);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $translate.instant('oops_wrong');
                });

        }).error(function (data, status, headers, config) {
            $rootScope.notify(
                $translate.instant('oops_wrong'));
        });
    };
    */


    /*API.getAll().success(function (data, status, headers, config) {
        $scope.games = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].name != null) {
                $scope.games.push(data[i]);
            }
        }
        if ($scope.games.length == 0) {
            $scope.noData = true;
        } else {
            for (var i = 0; i < $scope.games.length; i++) {
                var maxPoint = 0

                if ($scope.games[i].players != undefined) {
                    for (var d = 0; d < $scope.games[i].players.length; d++) {
                        if ($scope.games[i].players[d].points > maxPoint) {
                            maxPoint = $scope.games[i].players[d].points;
                        }
                    }
                }
                $scope.games[i].maxp = maxPoint;

                $scope.games[i].diff = Array.apply(null, Array($scope.games[i].difficulty)).map(function () {
                    return "ion-ios-star"
                });
            }
            $scope.noData = false;
        }
    }).error(function (data, status, headers, config) {
        $rootScope.notify(
            $translate.instant('oops_wrong'));
    });*/

    //Selected game
    $scope.gameSelect = function (gameName) {
        param = "/tab/playgame/" + gameName;
        $location.path(param);
    };


    // Create Activity
    $scope.submitPoint = function () {

        $scope.gamestype = Data.getType();
        var points = [];

        if ($scope.map.markers.length != 0) {
            for (var i = 0; i < $scope.map.markers.length; i++) {
                var point = {
                    name: $scope.map.markers[i].name,
                    description: $scope.map.markers[i].description,
                    lon: $scope.map.markers[i].lng,
                    lat: $scope.map.markers[i].lat,
                    created: Date.now(),
                    tasks: []
                };
                points.push(point);
            }

            // Complete Activity object
            $scope.activities = {
                points: points,
                type: $scope.gamestype
            };
            Data.newAct($scope.activities);
            Data.clearType();
            $scope.modal.remove();
        } else {
            console.log("No points specified");
            $scope.modal.remove();
        }
    };

})

.controller('TeacherCtrl', function ($rootScope, $scope, API, Edit, $timeout, $ionicModal, $window, $ionicHistory, 
	$translate, $ionicSlideBoxDelegate, $cordovaCamera, $q) {
    // List of all available games fetched from the server
    $scope.list = [];

    API.getAll().success(function (data, status, headers, config) {
        $scope.list = [];
        $scope.error_msg = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name != null) {
                $scope.list.push(data[i]);
            }
        }

        if ($scope.list.length == 0) {
            $scope.noData = true;
        } else {
            for (var i = 0; i < $scope.list.length; i++) {
                $scope.list[i].diff = Array.apply(null, Array($scope.list[i].difficulty)).map(function () {
                    return "ion-ios-star"
                });
            }
            $scope.noData = false;
        }
    }).error(function (data, status, headers, config) {
        $scope.error_msg = $translate.instant('network_error');
        $rootScope.notify(
            $translate.instant('oops_wrong'));
    });

    $scope.editedGame = {};
    $scope.deleteGame = {};
    $scope.animation = false;

    $scope.createGame = function () {
        // $scope.modal.remove();
        Edit.resetGame();
    };
    $scope.cancelGame = function () {
        $ionicHistory.goBack();
    };


    /* Game Creation Wizard (Test Version) ------------------------------------------------ */
    $scope.newgame = {}; //General description of the game
    $scope.navactivities = []; // List of activities and types
    $scope.act_type = 0;

    // Rate Game difficulty
    $scope.newgame.difficulty = 0;
    $scope.diff = Array.apply(null, Array(5)).map(function () {
        return "ion-ios-star-outline"
    });
    // Rate difficulty of the game in stars
    $scope.rateGame = function (difficulty) {
        $scope.diff = Array.apply(null, Array(5)).map(function () {
            return "ion-ios-star-outline"
        });
        for (var i = 0; i <= difficulty; i++) {
            $scope.diff[i] = "ion-ios-star";
        }
        $scope.newgame.difficulty = difficulty + 1;
    };

    //Show progress after step1

    //Choose Activity
    $scope.act_type = 0;
    $scope.chooseActType = function (type) {
        if (type == $scope.act_type)
            $scope.act_type = 0;
        else {
            $scope.act_type = type;
        }
    };

    var currentAct = {}; // Activity that is currently created
    $scope.addActivity = function () {
        $scope.newgame.activities = [];
        var newAct = {};
        currentAct.type = $scope.act_type == 1 ? "Find destination" : "Follow route";
        currentAct.points = [];
    }


    /* Map Routine ------------------- */
    $scope.mainMap = {
        center: {
            autoDiscover: true,
            zoom: 16
        },

        defaults: {
            tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 18,
            zoomControlPosition: 'topleft',
            lat: 57,
            lng: 8

        },

        geojson: {},

        paths: {
            userPos: {
                type: 'circleMarker',
                color: '#2E64FE',
                weight: 2,
                radius: 1,
                opacity: 0.0,
                clickable: false,
                latlngs: {
                    lat: 52,
                    lng: 7
                }
            },
            userPosCenter: {
                type: 'circleMarker',
                color: '#2E64FE',
                fill: true,
                radius: 3,
                opacity: 0.0,
                fillOpacity: 1.0,
                clickable: false,
                updateTrigger: true,
                latlngs: {
                    lat: 52,
                    lng: 7
                }
            }
        },

        markers: [],
        events: {
            /* map: {
                 enable: ['context'],
                 logic: 'emit'
             }*/
        },

        layers: {
            baselayers: {
                osm: {
                    name: 'Satelite View',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    type: 'xyz',
                    top: true,
                    layerOptions: {
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        continuousWorld: false
                    }
                },
                streets: {
                    name: 'Streets View',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz',
                    top: false,
                },
                topographic: {
                    name: 'Topographic View',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
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

    // Map for geoReference Game creation
    $scope.gameMap = {
        center: {
            autoDiscover: true,
            zoom: 16
        },

        defaults: {
            tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'topleft',
            lat: 57,
            lng: 8

        },

        geojson: {},

        paths: {
            userPos: {
                type: 'circleMarker',
                color: '#2E64FE',
                weight: 2,
                radius: 1,
                opacity: 0.0,
                clickable: false,
                latlngs: {
                    lat: 52,
                    lng: 7
                }
            },
            userPosCenter: {
                type: 'circleMarker',
                color: '#2E64FE',
                fill: true,
                radius: 3,
                opacity: 0.0,
                fillOpacity: 1.0,
                clickable: false,
                updateTrigger: true,
                latlngs: {
                    lat: 52,
                    lng: 7
                }
            }
        },

        markers: [],
        events: {
            map: {
                enable: ['click'],
                logic: 'emit'
            }
        },

        layers: {
            baselayers: {
                osm: {
                    name: 'Satelite View',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    type: 'xyz',
                    top: true,
                    layerOptions: {
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        continuousWorld: false
                    }
                },
                streets: {
                    name: 'Streets View',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz',
                    top: false,
                },
                topographic: {
                    name: 'Topographic View',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
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

    $scope.closeModal = function () {
        $scope.modal.remove();
    };
    $scope.noTask = function () {
        $scope.modal.remove();
        $scope.numberTask = 0;
    };

    $scope.$on('$destroy', function () {
        if (typeof $scope.modal != 'undefined') {
            $scope.modal.remove();
        }
    });

    //Add Waypoint with modal
    $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
        $scope.newWaypoint = new Waypoint();
        $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.newWaypoint.tasks = [];

        createModal('templates/map/waypoint.html', 'm1');
        //createModal('templates/tasks/quest_type.html');
    });

    $scope.$on('leafletDirectiveMap.click', function (event, locationEvent) {
        $scope.newWaypoint = new Waypoint();
        $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.newWaypoint.draggable = true;
        $scope.newWaypoint.message = "You can change this location";

        if ($scope.gameMap.markers.length == 0) {
            $scope.gameMap.markers.push($scope.newWaypoint);
        }
    });


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
            $scope.mainMap.markers.push($scope.newWaypoint);
            //console.log ($scope.mainMap.markers.length);

            $scope.closeModal();
            createModal('templates/tasks/task_choose.html', 'm2');
        }
    };

    /* Handle Task Creation routine */
    $scope.addQAtask = function () {
        $scope.qaTask = {};
        $scope.qaTask.answers = [{}, {}, {}, {}]; // Four answers - either text or images
        $scope.qaTask.question = {};

        $scope.picFile = [];
        $scope.picFilename = [];
        $scope.imgAnsPrvw = [];
        $scope.imgQuestionPrvw = null;

        $scope.modal.remove();
        $scope.qamodal = createModal('templates/tasks/quest_type.html');
    };

    $scope.addGRtask = function () {
        $scope.geoTask = {};

        $scope.closeModal();
        createModal('templates/tasks/georef_type.html');

        $scope.georP = null;
        $scope.gameMap.markers = [];
    };

    $scope.imgUpload = function(file, $event) {
        if (file) {
            var upload = API.uploadImage(file);
            var reader = new FileReader();
            var isQuestion = false;

            switch($event.target.id) {
                case 'photoAns1': 
                    picIndex = 0;
                    break;
                case 'photoAns2': 
                    picIndex = 1;
                    break;
                case 'photoAns3': 
                    picIndex = 2;
                    break;
                case 'photoAns4': 
                    picIndex = 3;
                    break;
                case 'photoQuestion': 
                    isQuestion = true;
                    break;
                case 'georefPic':
                    isGeoref = true;
                    break;
            }

            // Previewing the image
            reader.onload = function(event) {
                if (isGeoref) {
                    $scope.georefPicPrvw = event.target.result;
                } else if (!isQuestion) {
                    $scope.imgAnsPrvw[picIndex] = event.target.result;
                } else {
                    $scope.imgQuestionPrvw = event.target.result;
                }
                $scope.$apply();
            }
            
            reader.readAsDataURL(file);

            upload.then(function(res) {
                //console.log(res);
                if (res.status == 200) {
                    //$scope.picFilename[picIndex] = res.data.img_file;
                    if (isGeoref) {
                        $scope.geoTask.img = res.data.img_file;
                    } else if (isQuestion) {
                        $scope.qaTask.question.img = res.data.img_file;
                    } else {
                        $scope.qaTask.answers[picIndex].img = res.data.img_file;
                    }
                } else {
                    console.log('Error! Pic POSTed, but no filename returned')
                }
                //console.log($scope.picFilename);
            }), function(res) {
                console.log("Error uploading image.", res);
            }
        }
    };

    /* Picture is Loaded */
    $scope.onLoad1 = function (e, reader, file, fileList, fileOjects, fileObj) {
        $scope.picFile[0] = fileObj;
    };
    $scope.onLoad2 = function (e, reader, file, fileList, fileOjects, fileObj) {
        $scope.picFile[1] = fileObj;
    };
    $scope.onLoad3 = function (e, reader, file, fileList, fileOjects, fileObj) {
        $scope.picFile[2] = fileObj;
    };
    $scope.onLoad4 = function (e, reader, file, fileList, fileOjects, fileObj) {
        $scope.picFile[3] = fileObj;
    };

    $scope.submitQA = function (imgAnswers) {
        $scope.qaTask.type = "QA";
        //$scope.qaTask.imgans = imgAnswers;

        $scope.numberTask++;
        $scope.mainMap.markers[$scope.mainMap.markers.length - 1].tasks.push($scope.qaTask);
        //newMarker.tasks.push($scope.qaTask);

        $scope.closeModal();
        createModal('templates/tasks/task_choose.html');
    };


    $scope.onLoadG = function (e, reader, file, fileList, fileOjects, fileObj) {
        $scope.georP = fileObj;
    };
    
    $scope.submitGR = function (img_file) {
        /*Creation of game content */
        $scope.geoTask.type = "GeoReference";
        //$scope.geoTask.img = "data:image/jpeg;base64," + $scope.georP.base64;
        $scope.geoTask.lat = $scope.gameMap.markers[0].lat;
        $scope.geoTask.lng = $scope.gameMap.markers[0].lng;

        $scope.mainMap.markers[$scope.mainMap.markers.length - 1].tasks.push($scope.geoTask);
        //newMarker.tasks.push($scope.geoTask);

        $scope.numberTask++;
        $scope.closeModal();
        createModal('templates/tasks/task_choose.html');
        // $scope.georP = null;
    };

    // Calculated maximal score
    $scope.maxScore = 0;

    // Add points to the Activity
    $scope.addActPoints = function () {
        currentAct.points = $scope.mainMap.markers;
        $scope.newgame.activities.push(currentAct);
        $scope.newgame.players = [];

        $scope.maxScore = $scope.numberTask * 50 + $scope.mainMap.markers.length * 20;
    };

    $scope.stopCreation = function () {
        $ionicHistory.goBack();
        $ionicHistory.goBack();
        $scope.newgame = {};
        $scope.numberTask = 0;
    };

    $scope.finishGame = function () {
        API.saveItem($scope.newgame)
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
                $ionicHistory.goBack();
                $scope.newgame = {};
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
                $ionicHistory.goBack();
                $scope.newgame = {};
                $scope.numberTask = 0;
            });
    };
    /*
    $scope.finishGame = function () {
        var metaFile = [];
        API.getMetadata().success(function (data, status, headers, config) {
            metaFile = data;
            var metagame = {};
            metagame.name = $scope.newgame.name;
            metagame.description = $scope.newgame.description;
            metagame.timcompl = $scope.newgame.timecompl;
            metagame.difficulty = $scope.newgame.difficulty;

            metaFile[0].games.push(metagame);

            console.log(metagame);
            /*
            API.deleteItem("metadata", $rootScope.getToken())
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                }).error(function (data, status, headers, config) {
                    $rootScope.notify(
                        $translate.instant('oops_wrong'));
                });
            
            API.saveItem(metaFile)
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $translate.instant('oops_wrong');
                });

        }).error(function (data, status, headers, config) {

        });



        /*API.saveItem($scope.newgame)
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
                $ionicHistory.goBack();
                $scope.newgame = {};
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
                $ionicHistory.goBack();
                $scope.newgame = {};
                $scope.numberTask = 0;
            });


    };
    */

    $scope.removeMarkers = function () {
        $scope.modal.remove();
    };



    //Control of Navigation
    $scope.disableSwipe = function () {
        $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.emptyFields = [];

    $scope.slideTo = function (index) {
        if (index == 1) {
            $scope.emptyFields = [false, false, false];
            if ($scope.newgame.name == undefined || $scope.newgame.description == undefined || $scope.newgame.timecompl == undefined) {
                if ($scope.newgame.name == undefined) {
                    $scope.emptyFields[0] = true;
                }
                if ($scope.newgame.description == undefined) {
                    $scope.emptyFields[1] = true;
                }
                if ($scope.newgame.timecompl == undefined) {
                    $scope.emptyFields[2] = true;
                }
            } else {
                $ionicSlideBoxDelegate.slide(index);
            }
        } else if (index == 2) {
            if ($scope.act_type != 0) {
                $ionicSlideBoxDelegate.slide(index);
            }
        } else {
            $ionicSlideBoxDelegate.slide(index);
        }
    };

    /* ----------------------------------------------------------------------- */

    // Delete the entire game by clicking on the trash icon
    $scope.deleteItem = function (item, name) {
        API.deleteItem(name, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    $translate.instant('oops_wrong'));
            });
        $scope.list.splice($scope.list.indexOf(item), 1);
    };

    $scope.editItem = function (item) {
        $scope.navactivities = [];

        API.getOne(item.name)
            .success(function (data, status, headers, config) {
                $scope.deleteGame = data.slice()[0];
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    $translate.instant('oops_wrong'));
            });

        $scope.editedGame = $scope.list[$scope.list.indexOf(item)];
        $scope.navactivities = $scope.editedGame.activities;

        Edit.pushGame($scope.editedGame);
    };


    $scope.toggleActivity = function (activity) {
        activity.show = !activity.show;
    };
    $scope.isActivityShown = function (activity) {
        return activity.show;
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.saveEditedGame = function () {
        /*First delete the existing game, then save new instance.
             Not a very elegant solution, but i want to sleep already.*/

        //  console.log(JSON.stringify($scope.deleteGame) == JSON.stringify($scope.editedGame));
        API.deleteItem($scope.deleteGame.name, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $scope.list.splice($scope.list.indexOf($scope.deleteGame), 1);
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    $translate.instant('oops_wrong'));
            });

        API.saveItem($scope.editedGame)
            .success(function (data, status, headers, config) {
                $scope.list.push($scope.editedGame);
                $scope.modal.hide();
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $translate.instant('oops_wrong');
            });
    };
})

// Controller which controls new GAME creation
.controller('NewGameCtrl', ['$rootScope', '$scope', '$state', '$http', '$location', '$cordovaGeolocation', '$ionicModal', 'API', 'Edit', 'Data', 'Task', '$window', '$ionicPopup', '$ionicHistory', 'leafletData', '$stateParams', '$cordovaCamera', function ($rootScope, $scope, $state, $http, $location, $cordovaGeolocation,
    $ionicModal, API, Edit, Data, Task, $window, $ionicPopup, $ionicHistory, leafletData, $stateParams, $cordovaCamera, $translate) {

    /* Game Parameters ----- */
    $scope.currentAction = "New Game";
    $scope.newgame = {}; //General description of the game
    $scope.navactivities = []; // List of activities and types
    $scope.diff = Array.apply(null, Array(5)).map(function () {
        return "ion-ios-star-outline"
    });

    $scope.newgame.difficulty = 0;

    // Rate difficulty of the game in stars
    $scope.rateGame = function (difficulty) {
        $scope.diff = Array.apply(null, Array(5)).map(function () {
            return "ion-ios-star-outline"
        });
        for (var i = 0; i <= difficulty; i++) {
            $scope.diff[i] = "ion-ios-star";
        }
        $scope.newgame.difficulty = difficulty + 1;
    };

    // Check, whether we are CREATING or EDITING new game
    if (Edit.getGame() != null) {
        $scope.currentAction = "Edit Game";
        $scope.newgame = {
            title: Edit.getGame().name,
            description: Edit.getGame().description,
            time: Edit.getGame().timecompl,
            difficulty: Edit.getGame().difficulty
        };

        $scope.navactivities = Edit.getGame().activities;
        Edit.resetActivities();

        $scope.rateGame(Edit.getGame().difficulty - 1);

        for (var i = 0; i < Data.getAct().length; i++) {
            $scope.navactivities.push(Data.getAct()[i]);
        }
    } else {
        console.log(Data.getAct().length);
        $scope.navactivities = Data.getAct();
    }

    $scope.isAndroid = false; // Platform : Android or Web

    $scope.example = "";
    $scope.myfile = {};


    // Current location of GeoReference Task Creation
    $scope.map = {
        center: {
            autoDiscover: true,
            zoom: 16
        },
        defaults: {
            tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 18,
            zoomControlPosition: 'topleft',
            lat: 57,
            lng: 8
        },
        layers: {
            baselayers: {
                osm: {
                    name: 'Satelite',
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    type: 'xyz',
                    top: true
                },
                streets: {
                    name: 'Streets',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz',
                    top: false,
                }
            }
        },

        geojson: {},
        markers: [],
        events: {
            /* map: {
                 enable: ['context'],
                 logic: 'emit'
             }*/
        },
    };

    $scope.currentLocation = function () {
        $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {
                $scope.map.center.lat = position.coords.latitude;
                $scope.map.center.lng = position.coords.longitude;
                $scope.map.center.zoom = 15;
                $scope.map.center.message = $translate.instant('oops_wrong');
                $scope.map.markers.push($scope.map.center);

            }, function (err) {
                // error
                console.log("Geolocation error!");
                console.log(err);
            });
    };


    // PHOTO TASK

    // $scope.imgURI = null;
    $scope.example = "";

    $scope.myfile = {};
    $scope.isAndroid = ionic.Platform.isAndroid();
    //$scope.isWeb = (ionic.Platform.platform() == "win32");
    $scope.isWeb = !$scope.isAndroid;

    $scope.takePicture = function () {
        if ($scope.isAndroid) { // If the platform is Android than we take a picture
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                $scope.currentLocation();
            }, function (err) {
                // An error occured. Show a message to the user
            });
        } else { // If platform is Web than we are able to upload from the local storage
            $scope.currentLocation();
        }
    };


    $scope.choosePhoto = function () {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.currentLocation();
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

    /* After choosing Photo put a marker, indication your position on a map */
    var PhotoPositionMarker = function () {
        if (!(this instanceof PhotoPositionMarker)) return new PhotoPositionMarker();
        this.lat = "";
        this.lng = "";
    };
    $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
        if ($scope.map.markers.length < 1) {
            $scope.point = new PhotoPositionMarker();
            $scope.point.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.point.lng = locationEvent.leafletEvent.latlng.lng;;
            $scope.map.markers.push($scope.point);
        }
    });


    $scope.pathGame = function () {
        Data.addType("Find destination");
    };
    $scope.aidGame = function () {
        Data.addType("Follow route");
    };


    //Collapsed list with tasks for each activity
    $scope.toggleActivity = function (activity) {
        activity.show = !activity.show;
    };
    $scope.isActivityShown = function (activity) {
        return activity.show;
    };


    //Function, which add new task to the choosen activity
    $scope.currentActIndex = null;
    $scope.currentPointIndex = null;
    $scope.task = {};

    $scope.addTaskPoint = function (act, item) {
        var currentActivity = $scope.navactivities[$scope.navactivities.indexOf(act)];
        var pointIndex = currentActivity.points.indexOf(item);

        Task.addIndexes($scope.navactivities.indexOf(act), pointIndex);
    };

    //Addition of a TASK to an ACTIVITY POINT
    $scope.addQAtask = function () {
        Task.addType("QA");
    };
    $scope.addGRtask = function () {
        Task.addType("GeoReference");
    };

    //Submit task when running on Windows
    $scope.submitGRTask = function (uploadedPhoto) {
        //$scope.imgURI = "data:image/jpeg;base64," + uploadedPhoto.base64;

        Task.addPhoto($scope.imgURI);
        Task.addCoordinates($scope.map.markers[0].lat, $scope.map.markers[0].lng);

        $scope.task = Task.getTask();
        $scope.currentActIndex = Task.getActIndex();
        $scope.currentPointIndex = Task.getPointIndex();

        //Add created task to the choosen activity point
        $scope.navactivities[$scope.currentActIndex].points[$scope.currentPointIndex].tasks.push($scope.task);

        //Clear the scope and get back to the new game creation menu
        $scope.task = {};
        Task.clearTask();
        $scope.currentActIndex = null;
        $scope.currentPointIndex = null;

        $ionicHistory.goBack();
        Task.clearTask();

    };


    // Submit task for Android device
    $scope.submitGRTaskAndroid = function () {
        Task.addPhoto($scope.imgURI);
        Task.addCoordinates($scope.map.markers[0].lat, $scope.map.markers[0].lng);

        $scope.task = Task.getTask();
        $scope.currentActIndex = Task.getActIndex();
        $scope.currentPointIndex = Task.getPointIndex();

        //Add created task to the choosen activity point
        $scope.navactivities[$scope.currentActIndex].points[$scope.currentPointIndex].tasks.push($scope.task);

        //Clear the scope and get back to the new game creation menu
        $scope.task = {};
        Task.clearTask();
        $scope.currentActIndex = null;
        $scope.currentPointIndex = null;
        $ionicHistory.goBack();
        Task.clearTask();
    };


    /* QUESTION TASK -------------------------------*/
    $scope.qaGame = {};

    $scope.submitQATask = function () {
        Task.addQA($scope.qaGame);

        $scope.task = Task.getTask();
        $scope.currentActIndex = Task.getActIndex();
        $scope.currentPointIndex = Task.getPointIndex();

        //Add created task to the choosen activity point
        $scope.navactivities[$scope.currentActIndex].points[$scope.currentPointIndex].tasks.push($scope.task);
        //Clear the scope and get back to the new game creation menu
        $scope.task = {};
        Task.clearTask();
        $scope.currentActIndex = null;
        $scope.currentPointIndex = null;
        $scope.qaGame = {}; // Clear the game
        $ionicHistory.goBack();

        //console.log($scope.navactivities);
    };




    $scope.cancelGRTask = function () {
        $scope.task = {};
        $scope.imgURI = null;

        Task.clearTask();
        $scope.currentActIndex = null;
        $scope.currentPointIndex = null;
        $ionicHistory.goBack();
    };


    // Two main buttons - one, which submits the complete game to the server and one, which cancels the entire progress of creation
    $scope.submitGame = function () {
        if ($scope.newgame.title != null) { // Check if the title is not empty 
            $scope.border = "black";

            $scope.completeGame = {
                name: $scope.newgame.title,
                description: $scope.newgame.description,
                timecompl: $scope.newgame.time,
                difficulty: $scope.newgame.difficulty,
                activities: $scope.navactivities
            };

            if (Edit.getGame() != null) {
                API.deleteItem(Edit.getGame().name, $rootScope.getToken())
                    .success(function (data, status, headers, config) {
                        $rootScope.hide();
                        //$scope.list.splice($scope.list.indexOf($scope.completeGame), 1);

                        API.saveItem($scope.completeGame)
                            .success(function (data, status, headers, config) {
                                $rootScope.hide();
                                $rootScope.doRefresh(1);
                                $ionicHistory.goBack();
                                console.log("game is saved");
                                Data.clearAct();
                            })
                            .error(function (data, status, headers, config) {
                                $rootScope.hide();
                                $rootScope.notify("Oops something went wrong!! Please try again later");
                                $ionicHistory.goBack();
                                Data.clearAct();
                            });

                    }).error(function (data, status, headers, config) {
                        $rootScope.notify(
                            $translate.instant('oops_wrong'));
                    });
            } else {

                API.saveItem($scope.completeGame)
                    .success(function (data, status, headers, config) {
                        $rootScope.hide();
                        $rootScope.doRefresh(1);
                        $ionicHistory.goBack();
                        Data.clearAct();
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.hide();
                        $rootScope.notify("Oops something went wrong!! Please try again later");
                        $ionicHistory.goBack();
                        Data.clearAct();
                    });
            }

        } else {
            $scope.border = "red";
        }
    };

    $scope.cancelGame = function () {
        Data.clearAct();
        $ionicHistory.goBack();
    };

}])

// controller for gameplay
.controller('PlayCtrl', function ($scope, $stateParams, $ionicModal, $ionicPopup, $ionicLoading, $location, GameData, GameState, $timeout, $cordovaSocialSharing, $translate, API, PathData, PlayerStats) {
    $scope.gameName = $stateParams.gameName;
    $scope.gameLoaded = false;
    var congratsMessages = ['Good job!', 'Well done!', 'Great!', 'Cool!', 'Perfect!', 'So Fast! :)'];

    $scope.CORRECT_ANS_SCORE = 10;
    $scope.WRONG_ANS_PENALTY = 0;
    $scope.TIME_LIMIT = 30; // time limit to answer question (in seconds) 

    $scope.score = 0;

    /* only for debug purposes */
    var debugState = function () {
        return {
            gameName: $scope.gameName,
            gameloaded: $scope.gameLoaded,
            currentActivity: GameState.getCurrentActivity(),
            currentWaypoint: GameState.getCurrentWaypoint(),
            currentTask: GameState.getCurrentTask(),
            curActCleared: GameState.currentActivityCleared(),
            allWaypointsCleared: GameState.allWaypointsCleared(),
            allTasksCleared: GameState.allTasksCleared()
        };
    };

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

    var initGame = function () {
        GameState.resetAll();
        createModal('gameinfo-modal.html', 'info');
        $scope.gameLoaded = true;
        PlayerStats.init();
    };

    var abortGame = function (message) {
        $scope.errorMsg = message;
        createModal('error-modal.html', 'error');
    };

    var handleNextActivity = function () {
        var index = GameState.todoActivityIndex(); // Get next pending activity
        if (index == GameState.ERR_NO_ACTIVITIES) {
            abortGame($translate.instant('selected_game'));
        } else if (GameState.gameOver()) {
            endGame();
        } else {
            PlayerStats.startActivity(GameData.getActivity(index))
            handleNextWaypoint();
        }
    };

 
    $scope.showWaypointInfoModal = function() {
        createModal('waypointinfo-modal.html', 'wpinfo');
    };

   var handleNextWaypoint = function () {
        GameState.todoWaypointIndex(); // Get pending waypoint
        if (GameState.allWaypointsCleared()) {
            PlayerStats.endActivity();
            handleNextActivity();
        } else {
            var actIndex = GameState.getCurrentActivity();
            var pointIndex = GameState.getCurrentWaypoint();
            $scope.waypointImgURL = null;
            $scope.waypoint = GameData.getWaypoint(actIndex, pointIndex);
            if ($scope.waypoint.pic != undefined) {
                $scope.waypointImgURL = API.getImageURL($scope.waypoint.pic);
            }
            $scope.$broadcast('waypointLoadedEvent', $scope.waypoint);

            $scope.score += $scope.CORRECT_ANS_SCORE;
        }
    };

    var handleTask = function () {
        GameState.todoTaskIndex();
        if (GameState.allTasksCleared()) {
            handleNextWaypoint();
        } else {
            $scope.task = GameData.getTask(GameState.getCurrentActivity(), GameState.getCurrentWaypoint(), GameState.getCurrentTask());
            PlayerStats.startTask($scope.task);
            if ($scope.task.type == 'GeoReference') {
                $scope.performGeoReferencingTask($scope.task);
            } else if ($scope.task.type == 'QA') {
                performQATask($scope.task);
            } else {
                // perform other kinds of tasks here
                console.log("Handling other tasks, but of what kind?");
                handleTask();
            }
        }
    };

    $scope.performGeoReferencingTask = function () {
        $scope.showInfo = true;
        $scope.subHeaderInfo = "Mark location on map";
        $scope.geoRefPhoto = API.getImageURL($scope.task.img);
        createModal('georef-modal.html', 'georef');
    };

    var performQATask = function (task) {
        //$scope.showInfo = true;
        createModal('qa-modal.html', 'qa');

        //$scope.nonTextAnswer = false; // True if images are used as answers
        $scope.timeLeft = $scope.TIME_LIMIT;
        $scope.answerPicked = false;
/*
        if (typeof $scope.task.answers == 'undefined') {
            if (typeof $scope.task.imgans != 'undefined') {  
	            $scope.nonTextAnswer = true;
                $scope.task.answers = $scope.task.imgans;
            } else { 
                // Should not reach here.
                // TODO: Disallow creation of QA game without images or text answers
                //console.log($scope.task.imgans); 
                console.log("Activity did not have any image/text answers for questions");
            }
        }*/

        if (typeof $scope.task.answers == 'undefined') {
            console.log("No answers for this activity");
        }

        $scope.rightAnswer = $scope.task.answers[0]; // Correct answer is always at position 0
        $scope.chosenAnswer = "";
        $scope.clicked = [false, false, false, false];
        $scope.ansChoosen = false;
        $scope.answer = null; // true - right; false - wrong;

        //Shuffle the array to fill the answer boxes randomly
        var currentIndex = 4,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);

            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = $scope.task.answers[currentIndex];
            $scope.task.answers[currentIndex] = $scope.task.answers[randomIndex];
            $scope.task.answers[randomIndex] = temporaryValue;
        }

        $scope.imgAnsURL_0 = API.getImageURL($scope.task.answers[0].img);
        $scope.imgAnsURL_1 = API.getImageURL($scope.task.answers[1].img);
        $scope.imgAnsURL_2 = API.getImageURL($scope.task.answers[2].img);
        $scope.imgAnsURL_3 = API.getImageURL($scope.task.answers[3].img);
        $scope.imgRightAnswerURL = API.getImageURL($scope.rightAnswer.img);
        // console.log($scope.imgAnsURL_0, $scope.imgAnsURL_1, $scope.imgAnsURL_2, $scope.imgAnsURL_3);
    
        $scope.chooseAnswer = function (answer, index) {
            if (!$scope.ansChoosen) {
                $scope.chosenAnswer = answer;
                $scope.ansChoosen = true;
                $scope.answerPicked = true;
                $scope.clicked = [false, false, false, false];
                $scope.clicked[index] = true;

                clearInterval(intervalId);

                if ($scope.chosenAnswer == $scope.rightAnswer) {
                    $scope.answerResult = "Correct Answer!";
                    $scope.answer = true;
                    $scope.icon = "ion-android-happy";

                    $timeout(function () {
                        $scope.icon = "ion-android-happy";
                    }, 1200);
                    $scope.score += $scope.CORRECT_ANS_SCORE;
                } else {
                    $scope.answer = false;
                    $scope.answerResult = $translate.instant("wrong_ans_1");
                    $scope.rightAnswer = $scope.rightAnswer;
                    $scope.icon = "ion-sad-outline";
                    $scope.score -= $scope.WRONG_ANS_PENALTY;
                }
                PlayerStats.endTask({
                        'answer_correct' : $scope.answer,
                        'answer_chosen' : $scope.chosenAnswer
                });
            }
        };

        var intervalId = setInterval(function () {
            $scope.timeLeft--;
            if ($scope.timeLeft <= 0) {
                $scope.answerResult = $translate.instant("wrong_ans_1");
                $scope.rightAnswer = $scope.rightAnswer;
                $scope.icon = "ion-sad-outline";
                $scope.score -= 10;
                $scope.showOutput();
                $scope.modal.remove();

                clearInterval(intervalId);
            }
        }, 1000);

        $scope.showOutput = function () {
            $scope.$broadcast('qaTaskCompleted', $scope.task);
            $scope.answerPicked = false;
        };
    };


    $scope.$on('qaTaskCompleted', function (event) {
        $scope.congratsMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)]; // show random congrats message
        createModal('qa-result-modal.html', 'georefResult');
    });

    /* Show message, then execute proc is supplied as argument */
    var showPopup = function (title, msg, proc) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: msg
        });
        alertPopup.then(function (res) {
            if (typeof proc !== "undefined") {
                proc();
            }
        });
    };

    var gameLoadFailure = function (errString) {
        // Game did not load for some reason at this point
        console.log(errString);
    };

    $scope.$on('waypointReachedEvent', function (event) {
        $scope.congratsMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)]; // show random congrats message
        PlayerStats.endWaypoint();
        createModal('waypoint-reached-modal.html', 'waypoint');
    });

    $scope.$on('modal.hidden', function (event, modal) {
        // Start playing once the game info dialog is dismissed
        if (modal.id === 'info') {
            handleNextActivity();
        } else if (modal.id === 'endgame') {
            $location.path('/');
        } else if (modal.id === 'error') {
            $location.path('/');
        } else if (modal.id === 'georef') {
            $scope.$broadcast('georefEvent', $scope.task);
        } else if (modal.id === 'qa') {
            $scope.$broadcast('qaEvent', $scope.task);
        } else if (modal.id === 'georefResult') {
            handleTask();
        } else if (modal.id === 'qaResult') {
            handleTask();
        } else if (modal.id === 'waypoint') {
            handleTask();
        }
    });

    $scope.$on('$destroy', function () {
        if (typeof $scope.modal != 'undefined') {
            $scope.modal.remove();
        }
    });

    $scope.$on('geoRefMarkedEvent', function (event, distance) {
        $scope.geoResult = false;
        //showPopup('Result', 'The location you marked was ' + distance + "m away from the original location");
        $scope.georefDistance = distance;
        $scope.showInfo = false;
        $scope.subHeaderInfo = "";

        if (distance < 25) {
            $scope.georefSmiley = 'ion-happy-outline';
            $scope.geoResult = true;

            $scope.score += $scope.CORRECT_ANS_SCORE;
        } else {
            $scope.georefSmiley = 'ion-sad-outline';
            $scope.score -= $scope.WRONG_ANS_PENALTY;
        }
        createModal('georef-result-modal.html', 'georefResult');
    });

    /* Game Results */

    var endGame = function () {
        PlayerStats.endGame($scope.score);
        createModal('gameover-modal.html', 'endgame');

        $scope.shareButtons = false;
        $timeout(function () {
            $scope.shareButtons = true;
        }, 1200);

        showResults();

        $scope.$broadcast('gameOverEvent');

        $scope.shareViaFacebook = function (message, image, link) {
            $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function (result) {
                $cordovaSocialSharing.shareViaFacebook(message, image, link);
            }, function (error) {
                alert("Cannot share on Twitter");
            });
        };
    };

    $scope.players = [];
    var showResults = function () {
        API.getOne($scope.gameName)
            .success(function (data, status, headers, config) {
                $scope.players = data.slice()[0].players;
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    $translate.instant('oops_wrong'));
            });

        $scope.bestPlayers = function () {
            /* In order to get three best players */
            if ($scope.players.length < 3) {
                return $scope.players;
            } else {
                return $scope.players.slice(0, 3);
            }
        };

        $scope.player = {};
        $scope.addLeader = function () {
            $scope.player.points = $scope.score;
            $scope.players.push($scope.player);

            /* Comparison function in order to get three best players */
            function compare(a, b) {
                if (a.points > b.points)
                    return -1;
                else if (a.points < b.points)
                    return 1;
                else
                    return 0;
            };
            $scope.players.sort(compare);
        };
    };


    $scope.exitGame = function () {
        var delGame = {};

        //console.log(PathData.getPath());

        API.getOne($scope.gameName)
            .success(function (data, status, headers, config) {
                delGame = data.slice()[0];
                delGame.players = $scope.players;
                API.deleteItem($scope.gameName)
                    .success(function (data, status, headers, config) {

                        API.saveItem(delGame)
                            .success(function (data, status, headers, config) {})
                            .error(function (data, status, headers, config) {});

                    })
                    .error(function (data, status, headers, config) {});
            }).error(function (data, status, headers, config) {});

    };

    GameData.loadGame($scope.gameName).then(initGame, gameLoadFailure);
})




/* - Controller for map in student mode
 * - Only shows waypoint and emits signal when waypoint is reached
 * - Is not concerned with GameState or the game progression logic
 */
.controller('StudentMapCtrl', ['$scope', '$rootScope', '$cordovaGeolocation', '$stateParams', '$ionicModal', '$ionicLoading', '$timeout', 'leafletData', '$translate', 'PathData', 'PlayerStats',function ($scope, $rootScope, $cordovaGeolocation, $stateParams, $ionicModal, $ionicLoading, $timeout, leafletData, $translate, PathData, PlayerStats) {

    $scope.waypointLoaded = false;
    $scope.allowEdit = false;
    $scope.showMarker = false;

    /* Initialize view of map */
    $scope.initialize = function () {
        $scope.map = {
            defaults: {
                tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 19,
                zoomControlPosition: 'bottomleft'
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'Satelite View',
                        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        type: 'xyz',
                        top: true,
                        layerOptions: {
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                            continuousWorld: false
                        }
                    },
                    streets: {
                        name: 'Streets View',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz',
                        top: false,
                    },
                    topographic: {
                        name: 'Topographic View',
                        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                        type: 'xyz',
                        top: false,
                        layerOptions: {
                            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                            continuousWorld: false
                        }
                    }
                }
            },
            markers: {},
            paths: {

                // PATH DATA VISUALIZED 

                /*p1: {
                    color: '#008000',
                    weight: 5,
                    latlngs: PathData.getPath()
                }*/
            },
            events: {
                map: {
                    enable: ['contextmenu', 'move', 'zoomend'],
                    logic: 'emit'
                }
            },
            center: {
                lat: 0,
                lng: 0,
                zoom: 18
            }
        };

        $scope.geoLocButtonColor = "button-calm";
        $scope.playerMarkerButtonColor = "button-calm";
        $scope.getRealTimePos = false;
        $scope.initialDistance = 500;
        $scope.currentDistance = 0;
        $scope.thresholdDistance = 30;
        $scope.locate();
        $scope.$emit('mapLoadedEvent');
    };

    $scope.updatePlayerPosMarker = function (position) {
        if (typeof $scope.map.markers.PlayerPos === "undefined") {
            var playerMarker = './img/icons/marker-transparent.png';
            var marker = {
                lat: position.lat,
                lng: position.lng,
                message: "You are here",
                draggable: false,
                icon: {
                    iconUrl: playerMarker,
                    iconSize: [48, 48],
                    iconAnchor: [24, 48]
                }
            };
            $scope.map.markers.PlayerPos = marker;
        } else {
            $scope.map.markers.PlayerPos.lat = position.lat;
            $scope.map.markers.PlayerPos.lng = position.lng;
        }
    };

    /* Center map on user's current position */
    $scope.locate = function () {
        $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {
                $scope.map.center.lat = position.coords.latitude;
                $scope.map.center.lng = position.coords.longitude;
                //$scope.map.center.zoom = 15;
                $scope.updatePlayerPosMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, function (err) {
                // error
                console.log("Geolocation error!");
                console.log(err);
            });
    };

    /* Add more markers once game is loaded */
    $scope.$on('waypointLoadedEvent', function (event, waypoint) {
        PlayerStats.startWaypoint(waypoint);
        $ionicModal.fromTemplateUrl('waypointinfo-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.waypointName = waypoint.name;
            $scope.modal.show();
        });
        var marker = {
            lat: waypoint.lat,
            lng: waypoint.lng,
            message: waypoint.name,
            focus: true
        };
        $scope.map.markers.NextWaypoint = marker;
        $scope.destination = {
            lat: marker.lat,
            lng: marker.lng,
            name: marker.message
        };
        $scope.waypointLoaded = true; // reset this flag
    });

    /* Get bearing in degrees to destination */
    $scope.getBearing = function (orig, dest) {
        Number.prototype.toRadians = function () {
            return this * Math.PI / 180;
        };
        Number.prototype.toDegrees = function () {
            return this * 180 / Math.PI;
        };

        var lat1_radian = orig.lat.toRadians();
        var lng1_radian = orig.lng.toRadians();
        var lat2_radian = dest.lat.toRadians();
        var lng2_radian = dest.lng.toRadians();
        var lat_delta = (lat2_radian - lat1_radian).toRadians();
        var lng_delta = (lng2_radian - lng1_radian).toRadians();
        var y = Math.sin(lng2_radian - lng1_radian) * Math.cos(lat2_radian);
        var x = Math.cos(lat1_radian) * Math.sin(lat2_radian) - Math.sin(lat1_radian) * Math.cos(lat2_radian) * Math.cos(lng2_radian - lng1_radian);
        var bearing = Math.atan2(y, x).toDegrees();
        $scope.bearing = bearing;
    };

    /* (Re)compute distance to destination once map moves */
    $scope.$on('leafletDirectiveMap.move', function (event, args) {
        if ($scope.waypointLoaded) {
            var map = args.leafletEvent.target;
            var center = map.getCenter();

            PathData.addCoord(center.lat, center.lng);

            leafletData.getMap()
                .then(function (map) {
                    var center = map.getCenter();
                    var dest = L.latLng($scope.destination.lat, $scope.destination.lng);
                    var distance = center.distanceTo(dest);
                    if ($scope.initialDistance == -1) {
                        $scope.initialDistance = distance;
                        //console.log("Setting initial distance to ", distance);
                    }
                    $scope.currentDistance = distance;
                    $scope.getBearing(center, dest);

                    /* Don't place marker on map center if geolocation tracking is on. This is handled separately */
                    if (!$scope.getRealTimePos) {
                        $scope.updatePlayerPosMarker(center);
                    }

                    if (typeof $scope.drawSmiley !== "undefined") {
                        var maxDistance = parseFloat($scope.initialDistance) * 2;
                        // normalize distance to stop frowning once distance exceeds twice the initial distance to destination
                        // otherwise smiley frowns too much
                        var normalizedDistance = (parseFloat($scope.currentDistance) > maxDistance) ? maxDistance : parseFloat($scope.currentDistance);
                        $scope.drawSmiley($scope.canvas, $scope.canvasContext, normalizedDistance);
                    }
                    // If map center is within the threshold distance to destination, then the activity is complete
                    if (distance < $scope.thresholdDistance) {
                        $scope.waypointLoaded = false;
                        delete $scope.map.markers.NextWaypoint;
                        $scope.$emit('waypointReachedEvent');
                    }
                }, function (err) {
                    console.log("Could not get Leaflet map object - " + err);
                });
        }
    });

    $scope.$on('leafletDirectiveMap.zoomend', function (event, args) {
        if ($scope.getRealTimePos) {
            $scope.toggleGeoLocation(false);
            $scope.locate();
            $scope.toggleGeoLocation(false);
        }
    });

    var GeoRefPoint = function () {
        if (!(this instanceof GeoRefPoint)) return new GeoRefPoint();
        this.lat = "";
        this.lng = "";
        this.name = "";
    };

    $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
        if ($scope.allowEdit) {
            leafletData.getMap()
                .then(function (map) {
                    $scope.newGeoRefPoint = new GeoRefPoint();
                    $scope.newGeoRefPoint.lat = locationEvent.leafletEvent.latlng.lat;
                    $scope.newGeoRefPoint.lng = locationEvent.leafletEvent.latlng.lng;

                    var marker = {
                        lat: $scope.newGeoRefPoint.lat,
                        lng: $scope.newGeoRefPoint.lng,
                        message: "Marked photograph location",
                        focus: true,
                        icon: {
                            iconUrl: './img/icons/PhotoMarker2.png',
                            iconSize: [24, 38],
                            iconAnchor: [12, 38]
                        }
                    };
                    var marker2 = {
                        lat: $scope.georef.lat,
                        lng: $scope.georef.lng,
                        message: "Original photograph location",
                        focus: true,
                        icon: {
                            iconUrl: './img/icons/PhotoMarker1.png',
                            iconSize: [24, 38],
                            iconAnchor: [12, 38]
                        }
                    };
                    $scope.map.markers.playerPhotoMark = marker;
                    $scope.map.markers.origPhotoMark = marker2;

                    var origLocation = L.latLng($scope.georef.lat, $scope.georef.lng);
                    var markedLocation = L.latLng($scope.newGeoRefPoint.lat, $scope.newGeoRefPoint.lng);
                    var distance = parseInt(origLocation.distanceTo(markedLocation));

                    /* Georef task - Path from where the photograph was originally taken to where the player marked */
                    var path = {
                        type: "polyline",
                        color: 'red',
                        weight: 5,
                        latlngs: [origLocation, markedLocation]
                    };

                    $scope.map.paths = {
                        'georefTaskPath': path
                    };

                    $scope.map.center = {
                        lat: $scope.georef.lat,
                        lng: $scope.georef.lng,
                        zoom: $scope.map.center.zoom
                    };

                    $scope.allowEdit = false;
                    /* Draw and show path between original and marked locations for 2 seconds. Then show modal*/
                    $timeout(function () {
                        delete $scope.map.paths.georefTaskPath;
                        delete $scope.map.markers.playerPhotoMark;
                        delete $scope.map.markers.origPhotoMark;
                        PlayerStats.endTask ({
                            "marked_lat" : $scope.newGeoRefPoint.lat,
                            "marked_lng" : $scope.newGeoRefPoint.lng,
                            "distance_in_m" : distance
                        });
                        $scope.$emit('geoRefMarkedEvent', distance);
                    }, 2000);
                    //$scope.map.markers.pop();
                    //$scope.map.markers.pop();
                });
        };
    });

    $scope.$on('georefEvent', function (event, args) {
        $scope.allowEdit = true;
        $scope.georef = {};

        /* Dummy values. Remove after georeferecing task editing has been implemented*/
        if (typeof args.lat === "undefined") {
            $scope.georef.lat = 51.9649;
            $scope.georef.lng = 7.601;
            args.lat = 51.94;
            args.lng = 7.60;
        } else {
            /*********************************************************/
            $scope.georef.lat = args.lat;
            $scope.georef.lng = args.lng;
        }
    });

    $scope.trackPosition = function () {
        var watchOptions = {
            frequency: 100,
            maximumAge: 1000,
            timeout: 10000,
            enableHighAccuracy: true // may cause errors if true
        };
        $scope.trackWatch = $cordovaGeolocation.watchPosition(watchOptions);
        $scope.trackWatch.then(
            null,
            function (err) {
                $ionicLoading.show({
                    template: $translate.instant('error_geolocat'),
                    noBackdrop: true,
                    duration: 1000
                });
                console.log($translate.instant('error_watching'));
                console.log(err);
            },
            function (position) {
                $scope.map.center.lat = position.coords.latitude;
                $scope.map.center.lng = position.coords.longitude;
                $scope.updatePlayerPosMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
    };

    $scope.toggleGeoLocation = function (showInfo) {
        if ($scope.getRealTimePos == false) {
            $scope.getRealTimePos = true;

            if (showInfo) {
                $ionicLoading.show({
                    template: $translate.instant('now_using_geo'),
                    noBackdrop: true,
                    duration: 2000
                });
            }
            leafletData.getMap()
                .then(function (map) {
                    map.dragging.disable();
                });
            $scope.geoLocButtonColor = "button-balanced";
            $scope.thresholdDistance = 10;
            $scope.trackPosition();
        } else {
            $scope.getRealTimePos = false;
            leafletData.getMap()
                .then(function (map) {
                    map.dragging.enable();
                });
            $scope.thresholdDistance = 30;
            $scope.geoLocButtonColor = "button-calm";
            $scope.trackWatch.clearWatch();
        }
    };

    $scope.$on('gameOverEvent', function (event) {
        if ($scope.getRealTimePos == true) {
            // Turn off geolocation watch and reenable map drag
            $scope.toggleGeoLocation(false);
        }
    });

    // Show player position if button is pressed
    $scope.showPositionMarker = function () {
        if ($scope.showMarker == false) {
            $scope.showMarker = true;
            $scope.playerMarkerButtonColor = "button-balanced";

            if (typeof $scope.map.markers.PlayerPos != "undefined") {
                $scope.map.markers.PlayerPos.icon = {
                    iconUrl: './img/icons/Youarehere.png',
                    iconSize: [48, 48],
                    iconAnchor: [24, 48]
                };
                // Hide marker again after 5 seconds
                $timeout(function () {
                    $scope.map.markers.PlayerPos.icon = {
                        iconUrl: './img/icons/marker-transparent.png'
                    };
                    $scope.playerMarkerButtonColor = "button-calm";
                    $scope.showMarker = false;
                }, 5000);
            }
        }
    }

    $scope.initialize();

}]);
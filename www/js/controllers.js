angular.module('starter.controllers', ['starter.services', 'starter.directives'])

.controller('HomeCtrl', function ($scope) {})

.controller('GamesCtrl', function ($rootScope, $scope, $http, $location,
    $ionicModal, API, Data, $window, $timeout, $ionicPopup, $ionicHistory) {

    // Info Popups --------------------------------------
    $scope.showPathInfo = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Find destination',
            /* template: 'Navigators have to plan a path to reach the destination. They refer to the survey knowledge they already have available, combine it in new ways and possibly make inferences about missing pieces. Requires more cognitive effort.'*/
            template: 'Put longer tap on map to add point'
        });
    };

    $scope.showAidInfo = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Follow route',
            template: 'Put longer tap on map to add point'
                //template: 'Navigators follow a trail to the destination. Less cognitive effort.'
        });
    };
    
    //Get back in the history
    $scope.cancelGame = function () {
        $ionicHistory.goBack();
    };
    
    
    //--------------------------------------------------------------

    //test games
    /* $scope.games = $http.get('test_data/games.json').
     then(
         function (response) { // On success
             $scope.games = response.data;
             $scope.gameRetrievalFailed = false;
         },
         function (response) { // On failure
             $scope.gameRetrievalFailed = true;
             console.log("Unable to retrive games list. HTTP request failed - \"" + response + "\"");
         });*/


    // Fetch all the games from the server
    $scope.games = [];

    API.getAll().success(function (data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
            $scope.games.push(data[i]);
        }

        if ($scope.games.length == 0) {
            $scope.noData = true;
        } else {
            $scope.noData = false;
        }
    }).error(function (data, status, headers, config) {
        $rootScope.notify(
            "Oops something went wrong!! Please try again later");
        console.log("something was wrong");
    });

    //Selected game
    $scope.gameSelect = function (gameName) {
        param = "/tab/playgame/" + gameName;
        $location.path(param);
    };


    // Create Activity.
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
            $scope.$apply();
        } else {
            console.log("No points specified");
            $scope.modal.remove();
            $scope.$apply();
        }
    };
})

.controller('TeacherCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window,$ionicHistory) {
    // List of all available games fetched from the server
    $scope.list = [];
    $scope.editedGame = {};
    $scope.deleteGame = {};
    
    $scope.createGame = function(){
        $scope.modal.remove();
    };
    
        $scope.cancelGame = function () {
        $ionicHistory.goBack();
    };
    
    API.getAll().success(function (data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
            $scope.list.push(data[i]);
        }
        if ($scope.list.length == 0) {
            $scope.noData = true;
        } else {
            $scope.noData = false;
        }
    }).error(function (data, status, headers, config) {
        $rootScope.notify(
            "Oops something went wrong!! Please try again later");
        console.log("something was wrong");
    });

    // Delete the entire game by clicking on the trash icon
    $scope.deleteItem = function (item, name) {
        API.deleteItem(name, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();

            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    "Oops something went wrong!! Please try again later");
                alert("fail");
            });
        $scope.list.splice($scope.list.indexOf(item), 1);
    };



    // EDIT GAME PART ----------------------------------
    $ionicModal.fromTemplateUrl('templates/edit-game.html', {
           scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
         });
    
    $scope.editItem = function(item){
        $scope.navactivities = [];
        API.getOne(item.name)
            .success(function (data, status, headers, config) {
                 $scope.deleteGame = data.slice()[0];
            console.log($scope.deleteGame);
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    "Oops something went wrong!! Please try again later");
                alert("fail");
            });
         $scope.editedGame = $scope.list[$scope.list.indexOf(item)];
         $scope.navactivities = $scope.editedGame.activities;
         $scope.modal.show();
      };
    
    
 $scope.toggleActivity = function(activity) {
    activity.show = !activity.show;
  };
  $scope.isActivityShown = function(activity) {
    return activity.show;
  };
  $scope.closeModal = function(){
         $scope.modal.hide();
    };
    
  $scope.saveEditedGame = function(){
      /*First delete the existing game, then save new instance.
           Not a very elegant solution, but i want to sleep already.*/
      
      console.log(JSON.stringify($scope.deleteGame) ==  JSON.stringify($scope.editedGame));
      API.deleteItem($scope.deleteGame.name, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                 $scope.list.splice($scope.list.indexOf($scope.deleteGame), 1);
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    "Oops something went wrong!! Please try again later");
                alert("fail");
            });
      
        API.saveItem($scope.editedGame)
                .success(function (data, status, headers, config) {
                   $scope.list.push($scope.editedGame);
                    $scope.modal.hide();
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
  };
    
})


// Controller which controls new GAME creation
.controller('NewGameCtrl', ['$rootScope', '$scope', '$http', '$location', '$cordovaGeolocation', '$ionicModal', 'API', 'Data', 'Task', '$window', '$ionicPopup', '$ionicHistory', 'leafletData', '$stateParams', function ($rootScope, $scope, $http, $location, $cordovaGeolocation,
    $ionicModal, API, Data, Task, $window, $ionicPopup, $ionicHistory, leafletData, $stateParams) {
    $scope.newgame = {}; //General description of the game

    // Current location of GeoReference Task Creation
    $scope.map = {
        center: {
            autoDiscover: true,
            zoom: 16
        },
        defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'topleft',
            lat: 57,
            lng: 8
        },

        geojson: {},
        markers: [],
        events: {
            map: {
                enable: ['context'],
                logic: 'emit'
            }
          },
      };
    
     $scope.currentLocation = function(){
         $scope.ifgi = "/www/img/ifgi.jpg";
          $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {
                $scope.map.center.lat = position.coords.latitude;
                $scope.map.center.lng = position.coords.longitude;
                $scope.map.center.zoom = 15;
                $scope.map.center.message = "Photo was taken from here";
                $scope.map.markers.push($scope.map.center);

            }, function (err) {
                // error
                console.log("Geolocation error!");
                console.log(err);
            });
     };
        
    
    
    $scope.pathGame = function(){
        Data.addType("Find destination");
    };
    $scope.aidGame = function () {
        Data.addType("Follow route");
    };

    // List of activities and types
    $scope.navactivities = Data.getAct();
    // console.log($scope.navactivities);

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

    //Addition of a TASK to a ACTIVITY POINT
    $scope.addQAtask = function () {
        Task.addType("QuestionAnswer");
    };
    $scope.addGRtask = function () {
        Task.addType("GeoReference");
    };

    $scope.submitGRTask = function () {
        Task.addPhoto("./img/ifgi.jpg");

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

    $scope.cancelGRTask = function () {
        $scope.task = {};
        Task.clearTask();
        $scope.currentActIndex = null;
        $scope.currentPointIndex = null;
        $ionicHistory.goBack();
    };


    // Two main buttons - one, which submits the complete game to the server and one, which cancels the entire progress of creation
    $scope.submitGame = function () {
        $scope.completeGame = {
            name: $scope.newgame.title,
            description: $scope.newgame.description,
            timecompl: $scope.newgame.time,
            difficulty: $scope.newgame.difficulty,
            activities: $scope.navactivities
        };

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
    };

    $scope.cancelGame = function () {
        Data.clearAct();
        $ionicHistory.goBack();
    };
}])


// COntroller for view, which creates new tasks for already created activities
.controller('taskCreation', function ($rootScope, $scope, $http, $location, $ionicModal, API, Data, $window, $timeout, $ionicPopup, $ionicHistory) {
    //Type of the TASK
    $scope.addQAtask = function () {
        Data.addTaskType("Question - Answer");
    };
    $scope.addGRtask = function () {
        Data.addTaskType("GeoReference");
    };
})


// controller for gameplay
.controller('PlayCtrl', function ($scope, $stateParams, $ionicModal, $ionicPopup, $location, GameData, GameState) {
    $scope.gameName = $stateParams.gameName;
    $scope.gameLoaded = false;

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
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    var initGame = function () {
        GameState.resetAll();
        createModal('gameinfo-modal.html', 'info');
        $scope.gameLoaded = true;
    };

    var endGame = function () {
        createModal('gameover-modal.html', 'endgame');
    };

    var abortGame = function (message) {
        $scope.errorMsg = message;
        createModal('error-modal.html', 'error');
    };

    var handleNextActivity = function () {
        var index = GameState.todoActivityIndex(); // Get next pending activity
        if (index == GameState.ERR_NO_ACTIVITIES) {
            abortGame("The selected game has no activities to play. How about playing another game?");
        } else if (GameState.gameOver()) {
            console.log("GAME OVER!!!");
            endGame();
        } else {
            handleNextWaypoint();
        }
    };

    var handleNextWaypoint = function () {
        GameState.todoWaypointIndex(); // Get pending waypoint
        if (GameState.allWaypointsCleared()) {
            handleNextActivity();
        } else {
            var actIndex = GameState.getCurrentActivity();
            var pointIndex = GameState.getCurrentWaypoint();
            $scope.waypoint = GameData.getWaypoint(actIndex, pointIndex);
            $scope.$broadcast('waypointLoadedEvent', $scope.waypoint);
        }
    };

    var handleTask = function () {
        GameState.todoTaskIndex();
        if (GameState.allTasksCleared()) {
            handleNextWaypoint();
        } else {
            $scope.task = GameData.getTask(GameState.getCurrentActivity(), GameState.getCurrentWaypoint(), GameState.getCurrentTask());
            //console.log("Doing task -", GameState.getCurrentTask(), " of ", GameData.getNumTasks(GameState.getCurrentActivity(), GameState.getCurrentWaypoint()) - 1);
            if ($scope.task.type == 'GeoReference') {
                performGeoReferencingTask($scope.task);
            } else {
                // perform other kinds of tasks here
                handleTask();
            }
        }
    };

    var performGeoReferencingTask = function () {
        var lat = $scope.task.coordinates.lat;
        var lon = $scope.task.coordinates.lon;
        var img = $scope.task.photo;
        createModal('georef-modal.html', 'georef');
    };

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
        showPopup('Congrats!', 'You reached the destination - ' + $scope.waypoint.name, handleTask);
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
        }
    });

    $scope.$on('geoRefMarkedEvent', function (event, distance) {
        showPopup('Result', 'The location you marked was ' + distance + "m away from the original location");
        handleTask();
    });

    GameData.loadGame($scope.gameName).then(initGame, gameLoadFailure);

})

/* - Controller for map in student mode
 * - Only shows waypoint and emits signal when waypoint is reached
 * - Is not concerned with GameState or the game progression logic
 */
.controller('StudentMapCtrl', ['$scope', '$rootScope', '$cordovaGeolocation', '$stateParams', '$ionicModal', 'leafletData', function ($scope, $rootScope, $cordovaGeolocation, $stateParams, $ionicModal, leafletData) {

    $scope.waypointLoaded = false;
    $scope.allowEdit = false;

    /* Initialize view of map */
    $scope.initialize = function () {
        $scope.map = {
            defaults: {
                tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                maxZoom: 18,
                zoomControlPosition: 'bottomleft'
            },
            markers: [],
            events: {
                map: {
                    enable: ['contextmenu', 'move'],
                    logic: 'emit'
                }
            },
            center: {
                lat: 0,
                lng: 0,
                zoom: 12
            }
        };

        //$scope.goTo(0);
        $scope.initialDistance = 500;
        $scope.currentDistance = 0;
        $scope.locate();
        $scope.$emit('mapLoadedEvent');
    };

    /* Center map on user's current position */
    $scope.locate = function () {
        $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {
                $scope.map.center.lat = position.coords.latitude;
                $scope.map.center.lng = position.coords.longitude;
                $scope.map.center.zoom = 15;
                $scope.map.markers.push({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    message: "You Are Here",
                    draggable: false
                });
            }, function (err) {
                // error
                console.log("Geolocation error!");
                console.log(err);
            });
    };

    /* Add more markers once game is loaded */
    $scope.$on('waypointLoadedEvent', function (event, waypoint) {
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
            lng: waypoint.lon,
            message: waypoint.name,
            focus: true
        };
        $scope.map.markers.push(marker);
        $scope.destination = {
            lat: marker.lat,
            lng: marker.lng,
            name: marker.message
        };
        $scope.waypointLoaded = true; // reset this flag
    });


    /* (Re)compute distance to destination once map moves */
    $scope.$on('leafletDirectiveMap.move', function (event, args) {
        if ($scope.waypointLoaded) {
            var map = args.leafletEvent.target;
            var center = map.getCenter();
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
                    if (typeof $scope.drawSmiley !== "undefined") {
                        var maxDistance = parseFloat($scope.initialDistance) * 2;
                        // normalize distance to stop frowning once distance exceeds twice the initial distance to destination
                        // otherwise smiley frowns too much
                        var normalizedDistance = (parseFloat($scope.currentDistance) > maxDistance) ? maxDistance : parseFloat($scope.currentDistance);
                        $scope.drawSmiley($scope.canvas, $scope.canvasContext, normalizedDistance);
                    }
                    //console.log(distance);
                    var threshold = 30; // if map center is within the threshold distance to destination, then the activity is complete
                    if (distance < threshold) {
                        $scope.waypointLoaded = false;
                        $scope.$emit('waypointReachedEvent');
                    }
                }, function (err) {
                    console.log("Could not get Leaflet map object - " + err);
                });
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
                        message: "Your marked location",
                        focus: true
                    };
                    var marker2 = {
                        lat: $scope.georef.lat,
                        lng: $scope.georef.lng,
                        message: "Original location",
                        focus: true
                    };
                    $scope.map.markers.push(marker);
                    $scope.map.markers.push(marker2);

                    var origLocation = L.latLng($scope.georef.lat, $scope.georef.lng);
                    var markedLocation = L.latLng($scope.newGeoRefPoint.lat, $scope.newGeoRefPoint.lng);
                    var distance = origLocation.distanceTo(markedLocation);

                    $scope.allowEdit = false;
                    $scope.$emit('geoRefMarkedEvent', distance);
                });
        };
    });

    $scope.$on('georefEvent', function (event, args) {
        $scope.allowEdit = true;
        $scope.georef = {};

        /* Dummy values. Remove after georeferecing task editing has been implemented*/
        if (typeof args.coordinates.lat === "undefined") {
            $scope.georef.lat = 51.9649;
            $scope.georef.lng = 7.601;
            args.coordinates.lat = 51.94;
            args.coordinates.lng = 7.60;
        } else {
            /*********************************************************/
            $scope.georef.lat = args.coordinates.lat;
            $scope.georef.lng = args.coordinates.lng;
        }
    });

    $scope.initialize();

}]);

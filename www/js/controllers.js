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

.controller('TeacherCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    // List of all available games fetched from the server
    $scope.list = [];
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
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.editItem = function (item) {
        $scope.editedGame = [];
        $scope.navactivities = [];

        API.getOne(item)
            .success(function (data, status, headers, config) {
                $scope.editedGame = data.slice()[0];
                $scope.navactivities = $scope.editedActivity.activities;
            }).error(function (data, status, headers, config) {
                $rootScope.notify(
                    "Oops something went wrong!! Please try again later");
                alert("fail");
            });

        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
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

    $scope.currentLocation = function () {
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



    $scope.pathGame = function () {
        Data.addType("Path Planning");
    };
    $scope.aidGame = function () {
        Data.addType("Aided Wayfinding");
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
        Task.addPhoto("/www/img/ifgi.jpg");

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
        while (!GameState.allTasksCleared()) {
            task = GameData.getTask(GameState.getCurrentActivity(), GameState.getCurrentWaypoint(), GameState.getCurrentTask());
            console.log("Doing task -", GameState.getCurrentTask(), " of ", GameData.getNumTasks(GameState.getCurrentActivity(), GameState.getCurrentWaypoint()) - 1);
            GameState.todoTaskIndex();
        }
        if (GameState.allTasksCleared()) {
            handleNextWaypoint();
        }
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
        }
    });

    GameData.loadGame($scope.gameName).then(initGame, gameLoadFailure);

})

/* - Controller for map in student mode
 * - Only shows waypoint and emits signal when waypoint is reached
 * - Is not concerned with GameState or the game progression logic
 */
.controller('StudentMapCtrl', ['$scope', '$rootScope', '$cordovaGeolocation', '$stateParams', '$ionicModal', 'leafletData', function ($scope, $rootScope, $cordovaGeolocation, $stateParams, $ionicModal, leafletData) {

    $scope.waypointLoaded = false;

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
                    enable: ['move'],
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

    $scope.initialize();

}]);

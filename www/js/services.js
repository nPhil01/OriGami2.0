angular.module('starter.services', [])

.value('Server', 'giv-origami.uni-muenster.de:8000')

.factory('Data', function () {

    var actService = {};
    var allGames = [];

    actService.pushGame = function (value) {
        allGames.push(value);
    };
    actService.getGames = function () {
        return allGames;
    };


    var activities = [];
    var tasks = [];
    var gameType = ""; // Path planning / Aided Wayfinding 
    var taskType = ""; // Question - Answer / Georeference


    actService.newAct = function (value) {
        activities.push(value);
    };
    actService.addType = function (type) {
        gameType = type;
    };

    // Get all the current activities, game type (Path plan / Aid wayf)
    actService.getAct = function () {
        return activities;
    };
    actService.getType = function () {
        return gameType;
    };

    // Clean current activities, game types (Path plan / Aid wayf)
    actService.clearAct = function () {
        activities.splice(0, activities.length);
    };
    actService.clearType = function () {
        gameType = "";
    };
    return actService;
})

.factory('Task', function ($rootScope, $http, $ionicLoading, $window) {
    var taskService = {};
    var task = {}; // Question - Answer / Georeference

    // Index of a choosen ACTIVITY and POINT. Important, because we have to know where to add a certain task
    var currentActIndex = null;
    var currentPointIndex = null;

    // Add relevant information to the TASK
     taskService.addType = function(taskType){
         task.type = taskType;
     };
    taskService.addPhoto = function(taskPhoto){
         task.photo = taskPhoto;
     };
    taskService.addCoordinates = function(lat,lng){
         task.lat = lat;
         task.lng = lng;
     };
    
    taskService.addIndexes = function(actIndex,pointIndex){
       currentActIndex = actIndex;
       currentPointIndex = pointIndex;
    };
    
    // Get and Clear TASK 
    taskService.getTask = function () {
        return task;
    };
    taskService.clearTask = function () {
        task = {};
    };

    taskService.getActIndex = function () {
        return currentActIndex;
    };
    taskService.getPointIndex = function () {
        return currentPointIndex;
    };


    return taskService;
})


// API for getting data from the remote server
.factory('API', function ($rootScope, $http, $ionicLoading, $window, Server) {
    var base = "http://" + Server;
    /*$rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };*/
    $rootScope.hide = function () {
        $ionicLoading.hide();
    };

    /*$rootScope.notify = function (text) {
        $rootScope.show(text);
        $window.setTimeout(function () {
            $rootScope.hide();
        }, 1999);
    };*/

    $rootScope.doRefresh = function (tab) {
        if (tab == 1)
            $rootScope.$broadcast('fetchAll');
        else
            $rootScope.$broadcast('fetchCompleted');

        $rootScope.$broadcast('scroll.refreshComplete');
    };

    $rootScope.setToken = function (token) {
        return $window.localStorage.token = token;
    }

    $rootScope.getToken = function () {
        return $window.localStorage.token;
    };

    $rootScope.isSessionActive = function () {
        return $window.localStorage.token ? true : false;
    };

    return {
        getAll: function () {
            return $http.get(base + '/games', {
                method: 'GET',
            });
        },
        getOne: function (name) {
            return $http.get(base + '/games/item/' + name, {
                method: 'GET',
            });
        },
        saveItem: function (form) {
            return $http.post(base + '/games/item', form, {
                method: 'POST',
            });
        },
        /* putItem: function (id, form, email) {
         return $http.put(base+'/api/v1/bucketList/data/item/' + id, form, {
         method: 'PUT',
         params: {
         token: email
         }
         });
         },*/
        deleteItem: function (name) {
            return $http.delete(base + '/games/item/' + name, {
                method: 'DELETE',
            });
        }
    };
})

/* loads existing games from database */
.factory('GameData', function ($rootScope, $http, $filter, $q, Server) {
    var data = {};
    var game = {};
    var loaded = false;
    data.isLoaded = function () {
        return loaded;
    };
    data.getNumActivities = function () {
        if (loaded) {
            return game.activities.length;
        }
        return -1;
    };
    data.getNumWaypoints = function (activityIndex) {
        if (loaded) {
            return game.activities[activityIndex].points.length;
        }
        return -1;
    };
    data.getNumTasks = function (activityIndex, waypointIndex) {
        if (loaded) {
            return game.activities[activityIndex].points[waypointIndex].tasks.length;
        }
        return -1;
    };
    data.getActivity = function (index) {
        if (loaded) {
            return game.activities[index];
        }
        return -1;
    };
    data.getWaypoint = function (actIndex, pointIndex) {
        if (loaded) {
            return game.activities[actIndex].points[pointIndex];
        }
        return -1;
    };
    data.getTask = function (actIndex, pointIndex, taskIndex) {
        if (loaded) {
            return game.activities[actIndex].points[pointIndex].tasks[taskIndex];
        }
        return -1;
    };
    data.loadGame = function (name) {
        var defer = $q.defer();
        //var games = $http.get('test_data/games.json')
        var games = $http.get('http://' + Server + '/games/item/' + name)
            .then(
                function (response) { // On success
                    game = response.data[0];
                    loaded = true;
                    defer.resolve();
                    /*
                // load only those games which match selected game name
			 var selected_game = $filter('filter')(response.data, {
                         "name": name
			 }, true);
			 if (selected_game.length == 1) {
                         loaded = true;
                         game = selected_game[0];
                         defer.resolve();
			 } else {
                         console.log("Error! More than one game matched");
                         defer.reject("Error! More than one game matched");
			 }*/
                },
                function (response) { //On failure
                    console.log("Fetching game data. HTTP GET request failed");
                    console.log(response);
                    defer.reject("Unable to fetch game data. HTTP GET request failed");
                });
        return defer.promise;
    };

    return data;
})

/* holds current state of the game being played */
.factory('GameState', function (GameData, $rootScope) {
    var gameName = "";
    var startTime = (new Date()).toISOString();
    var endTime = "";
    var gameFinished = false;
    var activityFinished = false;
    var allWaypointsCleared = false;
    var tasksFinished = false;
    var activityIndex = -1; // Index of current activity in game
    var waypointIndex = -1; // Index of current waypoint in current activity
    var taskIndex = -1; // Index of current task in current activity + waypoint

    var resetTasks = function () {
        taskIndex = -1;
        tasksFinished = false;
    };
    var resetWaypoints = function () {
        waypointIndex = -1;
        allWaypointsCleared = false;
    };
    var resetActivities = function () {
        activityIndex = -1;
        activityFinished = false;
    };

    var state = {};

    state.gameOver = function () {
        return gameFinished;
    };
    state.setGameOver = function () {
        gameFinished = true;
    };
    state.getStartTime = function () {
        return startTime
    };
    state.getEndTime = function () {
        return endTime
    };
    state.setEndTime = function (time) {
        endTime = time
    };
    state.currentActivityCleared = function () {
        return activityFinished;
    };
    state.allTasksCleared = function () {
        return tasksFinished;
    };
    state.setTasksCleared = function () {
        tasksFinished = true
    };
    state.allWaypointsCleared = function () {
        return allWaypointsCleared;
    };
    state.getCurrentActivity = function () {
        return activityIndex
    };
    state.getCurrentWaypoint = function () {
        return waypointIndex
    };
    state.getCurrentTask = function () {
        return taskIndex
    };


    /* Return index of next playable Activity. 
     * If current activity is unfinished, return index of current activity
     */
    state.todoActivityIndex = function () {
        if (activityFinished == true) {
            if (activityIndex == GameData.getNumActivities() - 1) {
                // all activities are complete, hence game over
                gameFinished = true;
                // broadcast $rootScope signal maybe ???
                $rootScope.$broadcast('gameover');
            } else {
                // update vars to reflect we're in a new activity
                activityIndex++;
                // reset flags for new activity
                activityFinished = false;
                resetWaypoints();
            }
        } else {
            if (activityIndex == -1 || allWaypointsCleared == true) {
                activityIndex++;
            }
        }
        return activityIndex;
    };

    /* Return index of next waypoint. 
     * If current waypoint is not cleared, return index of current waypoint
     */
    state.todoWaypointIndex = function () {
        if (allWaypointsCleared == true) {
            //$rootScope.$broadcast('waypointscleared');
            //waypointIndex = -2; // invalid index
        } else {
            if (waypointIndex == GameData.getNumWaypoints(activityIndex) - 1) {
                allWaypointsCleared = true;
                tasksFinished = false;
                taskIndex = -1;
                activityFinished = true;
            } else {
                if (waypointIndex == -1 || tasksFinished) { // increment waypoint if all tasks are finished
                    waypointIndex++;
                    if (tasksFinished) {
                        resetTasks();
                    }
                }
            }
        }
        return waypointIndex;
    };

    state.todoTaskIndex = function () {
        if (tasksFinished == true) {
            //$rootScope.$broadcast('allTasksClearedEvent');
        } else {
            if (taskIndex == GameData.getNumTasks(activityIndex, waypointIndex) - 1) {
                tasksFinished = true;
            } else {
                taskIndex++;
            }
        }
        return taskIndex;
    };

    return state;
});

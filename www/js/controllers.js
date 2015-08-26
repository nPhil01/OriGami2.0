angular.module('starter.controllers', ['starter.services'])

.controller('HomeCtrl', function($scope) {})

.controller('GamesCtrl', function($rootScope, $scope, $http, $location, $ionicModal, API, Data, $window, $timeout, $ionicPopup,$ionicHistory) {
    
   //test games 
  $scope.games = $http.get('test_data/games.json').
  then(
    // On success
    function(response) {
      $scope.games = response.data;
      $scope.gameRetrievalFailed = false;
    },
    function(response) {
      $scope.gameRetrievalFailed = true;
      console.log("HTTP Get request failed " + response.statusText);
    });
  $scope.gameClick = function(gameId) {
    param = "/tab/playgame/" + gameId;
    $location.path(param);
  };
    
    
    // Show info popup for the Path planning task
  $scope.showPathInfo = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Path Planning',
     template: 'Navigators have to plan a path to reach the destination. They refer to the survey knowledge they already have available, combine it in new ways and possibly make inferences about missing pieces. Requires more cognitive effort.'
   });
 }; 
    
    
    // Show info popup for the Aided Navigation task
    $scope.showAidInfo = function() {
      var alertPopup = $ionicPopup.alert({
         title: 'Aided navigation',
         template: 'Navigators follow a trail to the destination. Less cognitive effort.'
      });
    };
    
    // Create Path plannning activity point and 
    $scope.submitPoint = function(){
        $scope.gamestype = Data.getType();
        $scope.activity = {
                name: $scope.map.markers[0].name,
                Description: $scope.map.markers[0].description,
                lon: $scope.map.markers[0].lng,
                lat: $scope.map.markers[0].lat,
                created: Date.now(),
                type: $scope.gamestype,
                tasks: ['task1', 'task2', 'task3']
            };
        Data.newAct($scope.activity);
        Data.clearType();
    };
})


.controller('TeacherCtrl', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    // List of all available games fetched from the server
   $scope.list = [];
  API.getAll().success(function(data, status, headers, config) {
    for (var i = 0; i < data.length; i++) {
      $scope.list.push(data[i]);
    };
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    $rootScope.hide();
  }).error(function(data, status, headers, config) {
    $rootScope.hide();
    $rootScope.notify("Oops something went wrong!! Please try again later");
    console.log("something was wrong");
  });
    
    
    // Delete the entire game by clicking on the trash icon
  $scope.deleteItem = function (name, item) {
       $scope.list.splice(item, 1);
            API.deleteItem(name, $rootScope.getToken())
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                }).error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                alert("fail");
                });
    };
    
    // Create a new game by clicking on the button with "+"
    $scope.createGame = function(){
        var gametitle = "newgame" + $scope.list.length;
        var form = {
            name: gametitle
        };
    
        /*API.saveItem(form)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });*/
    }
})

.controller('PlayCtrl', function($scope, $stateParams) {
  $scope.gameId = $stateParams.gameId;
})


.controller('NewGameCtrl', function($rootScope, $scope, $http, $location, $ionicModal, API, Data, $window, $timeout, $ionicPopup,$ionicHistory) {
    $scope.newgame = {}; //General description of the game
    
    $scope.pathGame = function(){
        Data.addType("Path Planning");
    };
    $scope.aidGame = function(){
        Data.addType("Aided Wayfinding");
    };
    
    // List of activities and types
    $scope.navactivities = Data.getAct();
    console.log($scope.navactivities); 
    
    //Collapsed list with tasks for each activity
  $scope.toggleActivity = function(activity) {
    activity.show = !activity.show;
  };
  $scope.isActivityShown = function(activity) {
    return activity.show;
  };
    
    // Submit game 
    $scope.submitGame = function(){
        if ($scope.newgame.title == undefined){
            
        };
        
        $scope.activity = {
                name: $scope.newgame.title,
                timecompl: $scope.newgame.time,
                difficulty: $scope.newgame.difficulty,
                activities: $scope.navactivities
            };
        
        API.saveItem($scope.activity)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
        //Data.clearAct();
    };
    
    $scope.cancelGame = function(){
        Data.clearAct();
        $ionicHistory.goBack();
    };
})


// COntroller for view, which creates new tasks for already created activities
.controller('taskCreation', function($rootScope, $scope, $http, $location, $ionicModal, API, Data, $window, $timeout, $ionicPopup,$ionicHistory) {   
})
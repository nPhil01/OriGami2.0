angular.module('starter.controllers', ['starter.services'])

.controller('HomeCtrl', function($scope) {})

.controller('GamesCtrl', function($scope, $http, $location) {
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
})

.controller('TeacherCtrl', function($rootScope, $scope, API, $timeout, $ionicModal, $window) {
  API.getAll().success(function(data, status, headers, config) {
    $scope.list = [];
    console.log(data);
    console.log(data.length);
    for (var i = 0; i < data.length; i++) {
      $scope.list.push(data[i]);
    };
    console.log($scope.list);
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }

    $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
      $scope.newTemplate = modal;
    });

    $scope.newTask = function() {
      $scope.newTemplate.show();
    };
    $rootScope.hide();
  }).error(function(data, status, headers, config) {
    $rootScope.hide();
    $rootScope.notify("Oops something went wrong!! Please try again later");
    console.log("something was wrong");

  });
})

.controller('PlayCtrl', function($scope, $stateParams) {
  $scope.gameId = $stateParams.gameId;
})

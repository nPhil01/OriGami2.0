// angular.module('starter.controllers', ['starter.services', 'starter.directives'])
//
// .controller('LoginCtrl', [ '$rootScope', '$scope', '$http', '$location', '$ionicModal', '$window', '$timeout',
//                             '$ionicPopup', '$ionicHistory', '$translate', 'API', 'Data',
//                             function ($rootScope, $scope, $http, $location, $ionicModal, $window, $timeout,
//                                         $ionicPopup, $ionicHistory, $translate, API, Data) {
//
//     // Info Popups --------------------------------------
//     $scope.showPathInfo = function () {
//         var alertPopup = $ionicPopup.alert({
//             title: $translate.instant('find_destination'),
//             /* template: 'Navigators have to plan a path to reach the destination. They refer to the survey knowledge they already have available, combine it in new ways and possibly make inferences about missing pieces. Requires more cognitive effort.'*/
//             template: $translate.instant('put_longer_tap')
//         });
//     };
//
//     $scope.showAidInfo = function () {
//         var alertPopup = $ionicPopup.alert({
//             title: $translate.instant('follow_route'),
//             template: $translate.instant('put_longer_tap')
//                 //template: 'Navigators follow a trail to the destination. Less cognitive effort.'
//         });
//     };
//     //Get back in the history
//     $scope.cancelGame = function () {
//         $ionicHistory.goBack();
//     };
//
//     // Fetch all the games from the server
//     $scope.games = [];
//     API.getMetadata().success(function (metadata, status, headers, config) {
//         $scope.error_msg = null;
//         $scope.games = [];
//         for (var i = 0; i < metadata.length; i++) {
//             $scope.games.push(metadata[i]);
//             $scope.games[i].diff = Array.apply(null, Array(metadata[i].diff)).map(function () {
//                 return "ion-ios-star"
//             });
//         }
//     }).error(function (data, status, headers, config) {
//         $scope.error_msg = $translate.instant('network_error');
//         console.log("Could not fetch game metadata from server");
//     });
//
//     //Selected game
//     $scope.gameSelect = function (gameName) {
//         param = "/tab/playgame/" + gameName;
//         $location.path(param);
//     };
//
//     // Create Activity
//     $scope.submitPoint = function () {
//
//         $scope.gamestype = Data.getType();
//         var points = [];
//
//         if ($scope.map.markers.length != 0) {
//             for (var i = 0; i < $scope.map.markers.length; i++) {
//                 var point = {
//                     name: $scope.map.markers[i].name,
//                     description: $scope.map.markers[i].description,
//                     lon: $scope.map.markers[i].lng,
//                     lat: $scope.map.markers[i].lat,
//                     created: Date.now(),
//                     tasks: []
//                 };
//                 points.push(point);
//             }
//
//             // Complete Activity object
//             $scope.activities = {
//                 points: points,
//                 type: $scope.gamestype
//             };
//             Data.newAct($scope.activities);
//             Data.clearType();
//             $scope.modal.remove();
//         } else {
//             console.log("No points specified");
//             $scope.modal.remove();
//         }
//     };
//
// }])

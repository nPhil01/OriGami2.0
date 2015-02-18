var app = angular.module("oriGamiGame", ['leaflet-directive']);

app.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: "navbar.html"
  }
});


app.controller("MapController", [ "$scope", function($scope) {
  // Nothing to see here yet!
}]);

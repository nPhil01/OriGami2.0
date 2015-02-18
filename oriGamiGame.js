var app = angular.module("oriGamiGame", ['leaflet-directive']);

app.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: "navbar.html"
  }
});


app.controller("MapController", [ "$scope", function($scope) {
  angular.extend($scope, {
    // Center the map
    center: {
      lat: 52,
      lng: 7,
      zoom: 6
    },
  });
}]);

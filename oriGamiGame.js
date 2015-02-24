var app = angular.module("oriGamiGame", ['leaflet-directive']);

app.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: "navbar.html"
  }
});

app.controller("NavigationController", [ "$scope", function($scope) {
  console.log("Create navigation controller");
  angular.extend($scope, {
    
  });
}]);

app.controller("MapController", [ "$scope", function($scope) {
  console.log("Create map controller");
  angular.extend($scope, {
    // Center the map
    center: {
      lat: 52,
      lng: 7,
      zoom: 6
    },
    layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                streets: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                topographic: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        }
  });
}]);

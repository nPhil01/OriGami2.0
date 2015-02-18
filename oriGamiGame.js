var app = angular.module("oriGamiGame", ['leaflet-directive'], ['ngGeolocation']);

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

 /*
  Geolocation Controller
    get current position with HTML5 Geolocation
  */
app.controller('GeolocationController',['$geolocation', '$scope' function ($geolocation, $scope){
  $scope.myPosition = $geolocation.getCurrentPosition({
  timeout: 60000
     }).then(function(position) {
            $scope.myPosition = position;
         });
    }]);

//watch position 

app.controller('GeolocationController',['$geolocation', '$scope' function ($geolocation, $scope){
   $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
        };
        $scope.myCoords = $geolocation.position.coords; // this is regularly updated
        $scope.myError = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
    }]);
   );

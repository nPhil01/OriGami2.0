angular.module('starter').controller("GeoCtrl", function($scope, $window){

  $window.navigator.geolocation.watchPosition( function(position) {
    //timeout: 60000,
    //maximumAge: 250,
    $scope.position = position
    console.log(position.coords.latitude+' '+position.coords.longitude+' '+position.coords.accuracy);
    // update map
    $scope.$apply(function(){
      $scope.map.center.lat = $scope.position.coords.latitude
      $scope.map.center.lng = $scope.position.coords.longitude
      $scope.map.center.zoom = 17
      $scope.updateMarker()
    });
  });

  $scope.updateMarker = function() {
    if ($scope.position != null) {
      $scope.map.paths.userPos.latlngs.lat = $scope.position.coords.latitude
      $scope.map.paths.userPos.latlngs.lng = $scope.position.coords.longitude
      $scope.map.paths.userPos.opacity = 1.0
      $scope.map.paths.userPos.radius = $scope.metersToPixels($scope.position.coords.accuracy)
      $scope.map.paths.userPos.updateTrigger = !$scope.map.paths.userPos.updateTrigger
    }
  }

  $scope.metersToPixels = function(meters) {
    // http://wiki.openstreetmap.org/wiki/Zoom_levels
    // S=C*cos(y)/2^(z+8)
    // circumference of earth in meters
    C = 40075017
    zoom = $scope.map.center.zoom
    y = $scope.position.coords.latitude
    // input for cosine function has to be converted in radians first
    distOnePixelInMeters = C*Math.cos(y*(Math.PI / 180))/Math.pow(2,(zoom+8))
    return (meters/distOnePixelInMeters)
  }

  $scope.$watch("map.center.zoom", function(zoom) {
    $scope.updateMarker();
  });

  $scope.$watch("map.paths.userPos.updateTrigger", function() {
    $scope.map.paths.userPosCenter.latlngs.lat = $scope.map.paths.userPos.latlngs.lat
    $scope.map.paths.userPosCenter.latlngs.lng = $scope.map.paths.userPos.latlngs.lng
    $scope.map.paths.userPosCenter.opacity = $scope.map.paths.userPos.opacity
  });

 
});
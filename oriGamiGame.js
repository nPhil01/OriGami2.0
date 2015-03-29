/*
The main part of the application, so far only in one javascript file.
TODO: split in components
*/

// our app requires the leaflet and ui.bootstrap directives
var app = angular.module("oriGamiGame", ['leaflet-directive','ui.bootstrap']);

// self containing navbar directive
app.directive('navbar', function() {
  return {
    scope: {
      layers: '=bindlayers' // two way binding
    },
    restrict: 'E',
    templateUrl: "navbar.html",
    link: function(scope, elem, attrs) {
    },
    // controller that connects the visibility of baselayers with selection in navbar
    controller: function($scope, $element){
      $scope.layerNames = [];
      // function that gets the layer names of layers object passed over to the directive
      $scope.setLayerNames = function () {
        for (var k in $scope.layers.baselayers) {
          $scope.layerNames[$scope.layerNames.length] = $scope.layers.baselayers[k].name
        }
      }
      // call function to set the layer names
      $scope.setLayerNames();
      // change visibility of layers based on passed layer name (function called on click on corresponding layer name in navbar)
      $scope.setLayer = function (layerName) {
        for (var k in $scope.layers.baselayers) {
          if ($scope.layers.baselayers[k].name==layerName) {
            $scope.layers.baselayers[k].top = true
          } else {
            $scope.layers.baselayers[k].top = false
          }
        }
      }
    }
  }
});

// custom directive for server connection
// TODO: put in factory and module
app.directive('server-connection', function() {
  return {
    restrict: 'E'
  }
});

// controller that provides function to load route from arcgis server
app.controller("ServerConnectionController", [ "$scope", function($scope) {
  // use custom layer element from angular-leaflet-directive to load route

  var routeID = "0GNo7"; // hardcoded example

  $scope.loadRoute = function (routeID) {
    L.esri.featureLayer('http://giv-learn2.uni-muenster.de/arcgis/rest/services/GeoSpatialLearning/route/MapServer/0',
    { fields: ['*'] }) // query all metadata fields
    .query()
    .where("route_id='"+routeID+"'") // filter by route id
    .run(function(error, featureCollection){ // run the query
      console.log(featureCollection); // so far only logging in console, TODO: use collection of waypoints in game
    });
  };

}]);

/*
The main controller of the app
*/
app.controller("MapController", [ "$scope", function($scope, $http) {
  console.log("Create map controller");
  // set the map properties
  angular.extend($scope, {
    // Center the map
    center: {
      autoDiscover: true,
      zoom: 8
    },
    defaults: { // center when user denies us the right to access geolocation
      lat: 52,
      lng: 7,
      zoom: 6
    },
    paths: { // paths for drawing the circular marker(s) visualizing the user pos.
      userPos: { // buffer around user position
        type: 'circleMarker',
        color: '#2E64FE',
        weight: 2,
        radius: 1,
        opacity: 0.0,
        clickable : false,
        latlngs: {lat: 52, lng: 7}
      },
      userPosCenter: { // small blue dot at center of circle that denotes user position
        type: 'circleMarker',
        color: '#2E64FE',
        fill: true,
        radius: 3,
        opacity: 0.0,
        fillOpacity: 1.0,
        clickable: false,
        updateTrigger: true,
        latlngs: {lat: 52, lng: 7}
      }
    },
    layers: { // a set of different baselayers, more can be found here: http://leaflet-extras.github.io/leaflet-providers/preview/
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz',
          top: true,
          layerOptions: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            continuousWorld: false
          }
        },
        streets: {
          name: 'Streets',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz',
          top: false,
          layerOptions: {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
            continuousWorld: false
          }
        },
        topographic: {
          name: 'Topographic',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz',
          top: false,
          layerOptions: {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
            continuousWorld: false
          }
        },
        satellite: {
          name: 'Satellite',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz',
          top: false,
          layerOptions: {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            continuousWorld: false
          }
        }
      }
    }
  });
}]);

// controller that takes care of obtaining the geo location
app.controller("GeoCtrl", function($scope, $window){

  // Function that watches the position and is called when it changes
  $window.navigator.geolocation.watchPosition( function(position) {
    //timeout: 60000,
    //maximumAge: 250,
    $scope.position = position // set position in app
    console.log(position.coords.latitude+' '+position.coords.longitude+' '+position.coords.accuracy);
    // update map
    $scope.$apply(function(){
      $scope.center.lat = $scope.position.coords.latitude
      $scope.center.lng = $scope.position.coords.longitude
      $scope.center.zoom = 17
      $scope.updateMarker()
    });
  });

  // function that updates the path objects (circle markers)
  $scope.updateMarker = function() {
    if ($scope.position != null) {
      $scope.paths.userPos.latlngs.lat = $scope.position.coords.latitude
      $scope.paths.userPos.latlngs.lng = $scope.position.coords.longitude
      $scope.paths.userPos.opacity = 1.0
      $scope.paths.userPos.radius = $scope.metersToPixels($scope.position.coords.accuracy) // update radius with accuracy of position
      $scope.paths.userPos.updateTrigger = !$scope.paths.userPos.updateTrigger // change value of update trigger that is watched below
    }
  }

  // function that converts meters to pixels for the current zoom level
  $scope.metersToPixels = function(meters) {
    // http://wiki.openstreetmap.org/wiki/Zoom_levels
    // S=C*cos(y)/2^(z+8)
    // circumference of earth in meters
    C = 40075017
    zoom = $scope.center.zoom
    y = $scope.position.coords.latitude
    // input for cosine function has to be converted in radians first
    distOnePixelInMeters = C*Math.cos(y*(Math.PI / 180))/Math.pow(2,(zoom+8))
    return (meters/distOnePixelInMeters)
  }

  // watch the current zoom level to update the size of accuracy based on zoom level
  $scope.$watch("center.zoom", function(zoom) {
    $scope.updateMarker();
  });

  $scope.$watch("paths.userPos.updateTrigger", function() {
    $scope.paths.userPosCenter.latlngs.lat = $scope.paths.userPos.latlngs.lat
    $scope.paths.userPosCenter.latlngs.lng = $scope.paths.userPos.latlngs.lng
    $scope.paths.userPosCenter.opacity = $scope.paths.userPos.opacity
  });

});

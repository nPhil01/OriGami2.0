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

.controller('TeacherCtrl', function($rootScope, $scope, API, $timeout,
  $ionicModal, $window) {
  API.getAll().success(function(data, status, headers, config) {
    $scope.list = [];
    console.log(data);
    console.log(data.length);
    for (var i = 0; i < data.length; i++) {
      $scope.list.push(data[i]);
    }
    console.log($scope.list);
    if ($scope.list.length === 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }

    $ionicModal.fromTemplateUrl('templates/newItem.html', function(
      modal) {
      $scope.newTemplate = modal;
    });

    $scope.newTask = function() {
      $scope.newTemplate.show();
    };
    $rootScope.hide();
  }).error(function(data, status, headers, config) {
    $rootScope.hide();
    $rootScope.notify(
      "Oops something went wrong!! Please try again later");
    console.log("something was wrong");

  });
})

.controller('PlayCtrl', function($scope, $stateParams, gameLoaderService) {
  $scope.gameId = $stateParams.gameId;
  $scope.settings = {};
  gameLoaderService.loadGame($scope.gameId, function(data) {
    console.log("In callback");
    $scope.settings = data;
  });
})

.controller('mapController', ['$scope', '$ionicModal', function($scope,
  $ionicModal) {
  $scope.map = {
    center: {
      autoDiscover: true,
      zoom: 16
    },
    defaults: {
      tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      maxZoom: 18,
      zoomControlPosition: 'topleft',
      lat: 52,
      lng: 7
    }
  };
}]);
/*
.controller('GeoCtrl', function($scope, $window) {
  $window.navigator.geolocation.watchPosition(function(position) {
    //timeout: 60000,
    //maximumAge: 250,
    $scope.position = position;
    console.log(position.coords.latitude + ' ' + position.coords.longitude +
      ' ' + position.coords.accuracy);
    // update map
    $scope.$apply(function() {
      $scope.map.center.lat = $scope.position.coords.latitude;
      $scope.map.center.lng = $scope.position.coords.longitude;
      $scope.map.center.zoom = 17;
      $scope.updateMarker();
    });
  });

  $scope.updateMarker = function() {
    if ($scope.position != null) {
      $scope.map.paths.userPos.latlngs.lat = $scope.position.coords.latitude;
      $scope.map.paths.userPos.latlngs.lng = $scope.position.coords.longitude;
      $scope.map.paths.userPos.opacity = 1.0;
      $scope.map.paths.userPos.radius = $scope.metersToPixels($scope.position
        .coords.accuracy);
      $scope.map.paths.userPos.updateTrigger = !$scope.map.paths.userPos.updateTrigger;
    }
  };

  $scope.metersToPixels = function(meters) {
    // http://wiki.openstreetmap.org/wiki/Zoom_levels
    // S=C*cos(y)/2^(z+8)
    // circumference of earth in meters
    C = 40075017;
    zoom = $scope.map.center.zoom;
    y = $scope.position.coords.latitude;
    // input for cosine function has to be converted in radians first
    distOnePixelInMeters = C * Math.cos(y * (Math.PI / 180)) / Math.pow(2, (
      zoom + 8));
    return (meters / distOnePixelInMeters);
  };

  $scope.$watch("map.center.zoom", function(zoom) {
    $scope.updateMarker();
  });

  $scope.$watch("map.paths.userPos.updateTrigger", function() {
    $scope.map.paths.userPosCenter.latlngs.lat = $scope.map.paths.userPos
      .latlngs.lat;
    $scope.map.paths.userPosCenter.latlngs.lng = $scope.map.paths.userPos
      .latlngs.lng;
    $scope.map.paths.userPosCenter.opacity = $scope.map.paths.userPos.opacity;
  });

});

.controller('MapController', ['$scope', '$ionicModal',
  function($scope, $ionicModal) {
    $scope.map = {
      center: {
        autoDiscover: true,
        zoom: 16
      },

      defaults: {
        tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        maxZoom: 18,
        zoomControlPosition: 'topleft',
        lat: 52,
        lng: 7
      },

      geojson: {},

      paths: {
        userPos: {
          type: 'circleMarker',
          color: '#2E64FE',
          weight: 2,
          radius: 1,
          opacity: 0.0,
          clickable: false,
          latlngs: {
            lat: 52,
            lng: 7
          }
        },
        userPosCenter: {
          type: 'circleMarker',
          color: '#2E64FE',
          fill: true,
          radius: 3,
          opacity: 0.0,
          fillOpacity: 1.0,
          clickable: false,
          updateTrigger: true,
          latlngs: {
            lat: 52,
            lng: 7
          }
        }
      },

      markers: {},
      events: {
        map: {
          enable: ['context'],
          logic: 'emit'
        }
      },

      layers: {
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
          }
          // },
          // streets: {
          //   name: 'Streets',
          //   url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          //   type: 'xyz',
          //   top: false,
          //   layerOptions: {
          //     attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
          //     continuousWorld: false
          //   }
          // },
          // topographic: {
          //   name: 'Topographic',
          //   url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          //   type: 'xyz',
          //   top: false,
          //   layerOptions: {
          //     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
          //     continuousWorld: false
          //   }
          // },
          // satellite: {
          //   name: 'Satellite',
          //   url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          //   type: 'xyz',
          //   top: false,
          //   layerOptions: {
          //     attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          //     continuousWorld: false
          //   }
          // }
        }
      }
    };

    /* Add Marker without Modal ( Wayfinding.html)
      $scope.map.markers = new Array();
     //Log :Coordinates by Click
      $scope.$on('leafletDirectiveMap.click', function(event, args){
        var latlng = args.leafletEvent.latlng;
        console.log('Lat: ' + latlng.lat + 'Lng: ' + latlng.lng);
        $scope.latn = args.leafletEvent.latlng.lat;
        $scope.lngn = args.leafletEvent.latlng.lng;
        $scope.map.markers.push({
              lat: latlng.lat,
              lng: latlng.lng,
              message: 'Test Lat: ' + latlng.lat + 'Lng: ' + latlng.lng
        });
      });

      //Get Log if marker is clicked
        $scope.$on('leafletDirectiveMarker.click', function(event, args){
        console.log( $scope.map.markers[args.markerName]);
         });


// $scope.map.markers = [];
// var Waypoint = function() {
//   if (!(this instanceof Waypoint)) return new Waypoint();
//   this.lat = "";
//   this.lng = "";
//   this.name = "";
// };
//
// $ionicModal.fromTemplateUrl('templates/waypoint.html', {
//   scope: $scope,
//   animation: 'slide-in-up'
// }).then(function(modal) {
//   $scope.modal = modal;
// });
//
//
//  Add Waypoint with modal
//
// $scope.$on('leafletDirectiveMap.contextmenu', function(event,
//   locationEvent) {
//   $scope.newWaypoint = new Waypoint();
//   $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
//   $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
//   $scope.modal.show();
// });
//
// $scope.saveWaypoint = function() {
//   $scope.map.markers.push($scope.newWaypoint);
//   $scope.modal.hide();
// };
}
]);
*/

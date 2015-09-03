
angular.module('starter').controller('aidController',[ '$scope','$ionicModal', 
    function(
      $scope,
      $ionicModal
      ) {
        $scope.map = {

          center:{
            autoDiscover: true,
            zoom: 16 
          },
          
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'topleft',
            lat: 57,
            lng: 8

          },

          geojson:{},
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          },
  };
   
  
   $scope.map.markers = new Array();
          
      var Waypoint = function() {
        if ( !(this instanceof Waypoint) ) return new Waypoint();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/map/aid_point.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Add Waypoint with modal
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newWaypoint = new Waypoint();
        $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;
        ;
        $scope.modal.show();
      });

      $scope.saveWaypoint = function() {
        $scope.map.markers.push($scope.newWaypoint);
        $scope.modal.remove();
      };
          
      $scope.saveAidPoint = function(){
           $scope.map.markers.push($scope.newWaypoint);
           $scope.modal.hide();
          };
          
     $scope.closeModal = function() {
         $scope.modal.hide();
      };
          
     $scope.removeMarkers = function(){
          $ionicHistory.goBack();
       };

    }]);



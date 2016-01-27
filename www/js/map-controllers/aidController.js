angular.module('starter').controller('aidController', ['$scope', '$ionicModal',
    function (
        $scope,
        $ionicModal
      ) {
        $scope.map = {

            center: {
                autoDiscover: true,
                zoom: 16
            },

            defaults: {
                tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 18,
                zoomControlPosition: 'topleft',
                lat: 57,
                lng: 8

            },
           layers: {
                baselayers: {
                    osm: {
                        name: 'Satelite View',
                        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        type: 'xyz',
                        top: true,
                        layerOptions: {
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                            continuousWorld: false
                        }
                    },
                    streets: {
                        name: 'Streets View',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz',
                        top: false,
                    },
                    topographic: {
                        name: 'Topographic View',
                        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                        type: 'xyz',
                        top: false,
                        layerOptions: {
                            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                            continuousWorld: false
                        }
                    }
                }
            },

            geojson: {},
            markers: {},
            events: {
                map: {
                    enable: ['context'],
                    logic: 'emit'
                }
            },
        };


        $scope.map.markers = new Array();

        var Waypoint = function () {
            if (!(this instanceof Waypoint)) return new Waypoint();
            this.lat = "";
            this.lng = "";
            this.name = "";
        };

        $ionicModal.fromTemplateUrl('templates/map/aid_point.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        /**
         * Add Waypoint with modal
         */
        $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
            $scope.newWaypoint = new Waypoint();
            $scope.newWaypoint.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newWaypoint.lng = locationEvent.leafletEvent.latlng.lng;;
            $scope.modal.show();
        });

        $scope.saveWaypoint = function () {
            $scope.map.markers.push($scope.newWaypoint);
            $scope.modal.remove();
        };

        $scope.saveAidPoint = function () {
            if (($scope.newWaypoint.name == "" || $scope.newWaypoint.name == undefined) || ($scope.newWaypoint.description == undefined || $scope.newWaypoint.description == "")) {

                if ($scope.newWaypoint.name == "" || $scope.newWaypoint.name == undefined) {
                    $scope.name_border = "red";
                } else {
                    $scope.name_border = "";
                }

                if ($scope.newWaypoint.description == undefined || $scope.newWaypoint.description == "") {
                    $scope.description_border = "red";
                } else {
                    $scope.description_border = "";
                }
            } else {
                $scope.name_border = "";
                $scope.description_border = "";

                $scope.map.markers.push($scope.newWaypoint);
                $scope.modal.hide();
            }
        };

        $scope.closeModal = function () {
            $scope.modal.hide();

            $scope.name_border = "";
            $scope.description_border = "";

        };

        $scope.removeMarkers = function () {
            $scope.modal.remove();
        };

    }]);
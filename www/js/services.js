angular.module('starter.services', [])
.factory('Data', function(){
    var activities = []; 
    var tasks = [];
    var gameType = "";
    
    var actService = {};
    
    actService.newAct = function(value){
        activities.push(value);
    };
    actService.addType = function(type){
        gameType = type;
    };
    
    // Get all the current activities and game types (Path plan / Aid wayf)
    actService.getAct = function(){
        return activities;
    };
    actService.getType = function(){
        return gameType;
    };
    
    // Clean current activities and game types (Path plan / Aid wayf)
    actService.clearAct = function(){
        activities.splice(0, activities.length);
    };
    
    actService.clearType = function(){
        gameType = "";
    };
    
    return actService;
})
.factory('API', function ($rootScope, $http, $ionicLoading, $window){
    var base = "http://giv-origami.uni-muenster.de:8000";
    $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };
    $rootScope.hide = function () {
            $ionicLoading.hide();
        };
 
 
        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 1999);
        };
 
        $rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('fetchAll');
            else
                $rootScope.$broadcast('fetchCompleted');
            
            $rootScope.$broadcast('scroll.refreshComplete');
        };
 
        $rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }
 
        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }
 
        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }
 
        return {
            getAll: function () {
                return $http.get(base + '/games', {
                    method: 'GET',
                });
            },
            getOne: function (name) {
                return $http.get(base+'/games/item/' + name, {
                    method: 'GET',
                });
            },
            saveItem: function (form) {
                return $http.post(base+'/games/item', form, {
                    method: 'POST',
                });
            },
           /* putItem: function (id, form, email) {
                return $http.put(base+'/api/v1/bucketList/data/item/' + id, form, {
                    method: 'PUT',
                    params: {
                        token: email
                    }
                });
            },*/
            deleteItem: function (name) {
                return $http.delete(base+'/games/item/' + name, {
                    method: 'DELETE',
                });
            }
        }
});
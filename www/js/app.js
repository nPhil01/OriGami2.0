// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'leaflet-directive', 'ionic-material', 'starter.controllers', 'starter.services', 'starter.directives', 'ngCordova'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins
                .Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:
    .state('tab.info', {
            url: '/info',
            views: {
                'tab-info': {
                    templateUrl: 'templates/info.html'
                }
            }
        })
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })

    .state('tab.avgames', {
            url: '/avgames',
            views: {
                'tab-home': {
                    templateUrl: 'templates/av-games.html',
                    controller: 'GamesCtrl'
                }
            }
        })
        .state('tab.teachmenu', {
            url: '/teachmenu',
            views: {
                'tab-home': {
                    templateUrl: 'templates/teach-menu.html',
                    controller: 'TeacherCtrl'
                }
            }
        })
        .state('tab.newgame', {
            url: '/teachmenu/newgame',
            views: {
                'tab-home': {
                    templateUrl: 'templates/new-game.html',
                    controller: 'NewGameCtrl'
                }
            }
        })
        .state('tab.playgame', {
            url: '/playgame/:gameName',
            views: {
                'tab-home': {
                    templateUrl: 'templates/play-game.html',
                    controller: 'PlayCtrl'
                }
            }
        })

    // Creation of task - Aided navigation and Path planning
    .state('tab.aidnavig', {
            url: "/aidnavig",
            views: {
                'tab-home': {
                    templateUrl: "templates/map/aid_navig.html",
                    controller: 'MapController'
                }
            }
        })
        .state('tab.pathplan', {
            url: "/pathplan",
            views: {
                'tab-home': {
                    templateUrl: "templates/map/path_plan.html",
                    controller: 'MapController'
                }
            }
        })
        .state('tab.quest', {
            url: "/qtask",
            views: {
                'tab-home': {
                    templateUrl: "templates/tasks/quest.html",
                    controller: 'taskCreation'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

});

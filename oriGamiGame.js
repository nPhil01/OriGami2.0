var app = angular.module("oriGamiGame", []);

app.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: "navbar.html"
  }
});

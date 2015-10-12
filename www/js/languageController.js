angular.module('starter').controller('languageController',[ '$scope','$ionicModal','$translate',
   function($scope,$ionicModal,$translate
      ) {
       $scope.changeLanguage = function(language){
		  $translate.use(language);
        };
   }]);
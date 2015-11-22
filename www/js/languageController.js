angular.module('starter').controller('languageController', ['$scope', '$ionicModal', '$translate', '$timeout',
   function ($scope, $ionicModal, $translate, $timeout) {
        $scope.currentLanguage = "English";
        $scope.icon = 'question_answer';
       
        $scope.changeLanguage = function (language) {
            $translate.use(language);

            if (language == "prt")
                $scope.currentLanguage = "Portuguese";
             if (language == "esp")
                $scope.currentLanguage = "Spanish";
             if (language == "cat")
                $scope.currentLanguage = "Catalan";
             if (language == "de")
                $scope.currentLanguage = "Deutsch";
            if (language == "en")
                $scope.currentLanguage = "English";
            
             $scope.icon = 'thumb_up';
            
            $timeout(function() {
            $scope.icon = 'question_answer';
           }, 1200);
        };


   }]);
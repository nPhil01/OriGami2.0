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

[{
    "name": "FD demo 1",
    "description": "Semana aberta UA 24/11/2015",
    "timecompl": "20 min.",
    "difficulty": 2,
    "activities": [{
        "points": [{
            "name": "Reitoria",
            "description": "Entrada da reitoria da UA",
            "lon": -8.657556731723162,
            "lat": 40.63122281700757,
            "created": 1448364040337,
            "tasks": []
        }],
        "type": "Find destination",
        "show": true
    }, {
        "points": [{
            "name": "Ponto 2",
            "description": "Farmacia",
            "lon": -8.658868074417114,
            "lat": 40.630935421930296,
            "created": 1448364140014,
            "tasks": []
        }],
        "type": "Follow route",
        "show": false
    }],
    "_id": "56544a74d006e13f05bd23dd"
}, {
    "name": "FR demo 2",
    "description": "Semana aberta 24/11/2015",
    "timecompl": "20 min.",
    "difficulty": 2,
    "activities": [{
        "points": [{
            "name": "Ponto 1",
            "description": "Sai do DE e vira Ã  direita; continua em frente. Quando tiveres a biblioteca do lado direito vira Ã  esquerda e desce as escadas. Vira Ã  esquerda e chegaste ao destino.",
            "lon": -8.65874469280243,
            "lat": 40.630866212119926,
            "created": 1448364968505,
            "tasks": []
        }],
        "type": "Follow route",
        "show": true
    }],
    "_id": "56544b9fd006e13f05bd23de"
}, {
    "name": "4",
    "description": "Semana ua",
    "timecompl": "20",
    "difficulty": 1,
    "activities": [{
        "points": [{
            "name": "4",
            "description": "Semana ua",
            "lon": -8.659498844554037,
            "lat": 40.633549383305876,
            "created": 1448382760712,
            "tasks": []
        }],
        "type": "Find destination"
    }],
    "_id": "565490f0d006e13f05bd23df"
}, {
    "name": "VÃ¢nia 2",
    "description": "Percorre a rota na universidade de Aveiro.",
    "difficulty": 3,
    "activities": [{
        "points": [{
            "name": "Biblioteca",
            "description": "Responder a tarefa 1",
            "lon": -8.659812211990356,
            "lat": 40.63127739876385,
            "created": 1448554365284,
            "tasks": []
        }, {
            "name": "Cantina",
            "description": "Responder a tarefa 2",
            "lon": -8.659033368167002,
            "lat": 40.630586058298086,
            "created": 1448554365292,
            "tasks": []
        }, {
            "description": "Responder ÃƒÂ¡ tarefa 3",
            "lon": -8.655397156389881,
            "lat": 40.62903726418359,
            "created": 1448554365293,
            "tasks": []
        }, {
            "description": "The End!!!",
            "lon": -8.65624379028759,
            "lat": 40.628079647735056,
            "created": 1448554365293,
            "tasks": []
        }],
        "type": "Follow route"
    }],
    "_id": "56572f40d006e13f05bd23e0",
    "diff": ["ion-ios-star", "ion-ios-star", "ion-ios-star"]
}, {
    "name": "sfagha",
    "description": "sdfgasg",
    "timecompl": "asdfg",
    "difficulty": 3,
    "activities": [{
        "points": [{
            "name": "asdf",
            "description": "asdf",
            "lon": 7.5894713401794425,
            "lat": 51.970486558026955,
            "created": 1450377484873,
            "tasks": [{
                "type": "QA",
                "question": "asdgas",
                "answers": {
                    "0": "gasd",
                    "1": "gasd",
                    "2": "gasdg",
                    "3": "asg"
                }
            }]
        }],
        "type": "Find destination",
        "show": true
    }],
    "_id": "567300afd006e13f05bd2415"
}]
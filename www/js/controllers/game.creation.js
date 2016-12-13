(function () {
	'use strict';

	angular
		.module('starter')
		.controller('GameCreationController', GameCreationController);

	GameCreationController.$inject = ['$ionicHistory', '$ionicSlideBoxDelegate'];

	function GameCreationController ($ionicHistory, $ionicSlideBoxDelegate) {
		var vm = this;
		vm.newgame = {}; //General description of the game
		vm.abort = abort;
		vm.invalidForm = true;
		vm.act_type = 0;
		vm.previousSlide = previousSlide;
		vm.nextSlide = nextSlide;
		vm.slideChanged = slideChanged;
		vm.showSlideButtons = showSlideButtons;
		vm.diff = Array.apply(null, Array(5)).map(function () {
        	return "ion-ios-star-outline"
    	});
    	vm.rateGame = rateGame;
    	vm.initSlideBox = initSlideBox;
		vm.submit = submit;
		vm.currentAct = {}; // Activity that is currently created
		vm.chooseActType = chooseActType;
		vm.finishGame = finishGame;
		vm.slideTitle = 'General Information';

		activate();

		////////////////////////////

		function activate () {
			
		}	

		function initSlideBox () {
			$ionicSlideBoxDelegate.enableSlide(false);
		}

		function submit (invalid) {
			vm.invalidForm = invalid;
		}

		function previousSlide () {
			$ionicSlideBoxDelegate.previous();
		}

		function nextSlide () {
			if ($ionicSlideBoxDelegate.currentIndex() === 1) {
				addActivity();
			}
			$ionicSlideBoxDelegate.next();
		}

		function slideChanged (slideIndex) {
			console.log('slide changed');
			console.log(vm.newgame)
			if (slideIndex === 0) {
				vm.slideTitle = 'General Information';
			}
			if (slideIndex === 1) {
				vm.slideTitle = 'Choose Activity Type';
				if (vm.act_type === 0) {
					submit(true);
				} else {
					submit(false);
				}
			}
			if (slideIndex === 2) {
				vm.slideTitle = 'Add points to the map';
			}
			if (slideIndex === 3) {
				vm.slideTitle = 'Congratulation!';	
			}
		}

		function showSlideButtons () {
			let currentIndex = $ionicSlideBoxDelegate.currentIndex();
			let slidesCount = $ionicSlideBoxDelegate.slidesCount();
			let showPrevious = false;
			let showNext = true;
			let saveButton = false;

			if (currentIndex === 0) {
				showPrevious = false;
			} else if (currentIndex > 0 && currentIndex < slidesCount - 2) {
				showPrevious = true;
			} else if (currentIndex === slidesCount - 2) {
				showPrevious = true;
				showNext = false;
				saveButton = true;
			} else if (currentIndex === slidesCount - 1) {
				showPrevious = false;
				showNext = false;
				saveButton = false;
			}

			return { 
				showPrevious: showPrevious, 
				showNext: showNext, 
				saveButton: saveButton 
			}
		}

		function rateGame (difficulty) {
			vm.diff = Array.apply(null, Array(5)).map(function () {
			    return "ion-ios-star-outline"
			});
			for (var i = 0; i <= difficulty; i++) {
			    vm.diff[i] = "ion-ios-star";
			}
			vm.newgame.difficulty = difficulty + 1;
		}

		function abort () {
			$ionicHistory.goBack();
		}

		//Choose Activity
		function chooseActType (type) {
		    if (type === vm.act_type) {
		        vm.act_type = 0;
		    	submit(true);
		    } else {
		        vm.act_type = type;
		        submit(false);
		    }
		}

	    function addActivity () {
	        vm.newgame.activities = [];
	        vm.currentAct.type = vm.act_type == 1 ? "Find destination" : "Follow route";
	        vm.currentAct.points = [];
	    }

	    function finishGame () {
	    	nextSlide();
	        // API.saveItem(vm.newgame)
	        //     .success(function (data, status, headers, config) {
	        //         // $rootScope.hide();
	        //         // $rootScope.doRefresh(1);
	        //         // $ionicHistory.goBack();
	        //         // $scope.newgame = {};
	        //     })
	        //     .error(function (data, status, headers, config) {
	        //         // $rootScope.hide();
	        //         // $rootScope.notify("Oops something went wrong!! Please try again later");
	        //         // $ionicHistory.goBack();
	        //         // $scope.newgame = {};
	        //         // $scope.numberTask = 0;
	        //     });
	    }
	}
})();
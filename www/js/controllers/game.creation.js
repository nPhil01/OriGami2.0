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
			$ionicSlideBoxDelegate.next();
		}

		function slideChanged (slideIndex) {
			console.log('slide changed');
		}

		function showSlideButtons () {
			let currentIndex = $ionicSlideBoxDelegate.currentIndex();
			let slidesCount = $ionicSlideBoxDelegate.slidesCount();
			let showPrevious = false;
			let showNext = true;
			let saveButton = false;

			if (currentIndex === 0) {
				showPrevious = false;
			} else if (currentIndex > 0 && currentIndex < slidesCount - 1) {
				showPrevious = true;
			} else if (currentIndex === slidesCount - 1) {
				showPrevious = true;
				showNext = false;
				saveButton = true;
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
	}
})();
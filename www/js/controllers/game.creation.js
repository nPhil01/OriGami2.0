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
		vm.previousSlide = previousSlide;
		vm.nextSlide = nextSlide;
		vm.slideChanged = slideChanged;
		vm.showSlideButtons = showSlideButtons;

		activate();

		////////////////////////////

		function activate () {
			$ionicSlideBoxDelegate.enableSlide(false);
		}

		function previousSlide () {
			$ionicSlideBoxDelegate.previous();
		}

		function nextSlide () {
			$ionicSlideBoxDelegate.next();
			console.log(vm.newgame);
		}

		function slideChanged (slideIndex) {
			
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

		function abort () {
			$ionicHistory.goBack();
		}
	}
})();
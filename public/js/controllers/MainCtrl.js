angular.module('MainCtrl', ['smoothScroll']).controller('MainController', function($scope, $http, $routeParams, $location, $window) {
	$scope.menuLoaded = false;
	$scope.timeout = null;
	$scope.showsuggestions = false;
	$scope.loading = true;

	$scope.seo = {
		title: "Explore Vitamins with the Power of Data",
		desc: "Utilizes the power of data to help you purchase the right vitamins &amp; supplements. Our algorithm uses a multitude of data points across a variety of sources to help make a purchase.",
		site_name: "Vitamin.io",
		image: "",
		image_width: 50,
		image_height: 50,
		image_type: "image/jpg",
		url: location.href
	}

	$http.post( '/get-categories', {} ).then( function(response) {
		$scope.categories = response.data;
		$scope.loading = false;

		if ( $scope.menuLoaded == false ) {
			$scope.menuLoaded = true;

			jQuery( document ).ready( function() {
				setTimeout( function() { 
					Webflow.require('dropdown').ready();
				}, 1000 );
			} );
		}
	});

	/* $scope.$on('$viewContentLoaded', function(event) {
		
	}); */

	$scope.dosearch = function() {
		$location.path('/searchkeyword/' + $scope.keyword);
		
		$scope.showsuggestions = false;
		$scope.keyword = "";
	}

	$scope.getsuggestions = function() {
		if ( $scope.keyword.length < 2 ) {
			$scope.suggestions = [];
			$scope.showsuggestions = false;
			return;
		}

		if ( $scope.timeout != null ) clearTimeout( $scope.timeout );

		$scope.timeout = setTimeout( function() {
			$http.post( "get-suggestions", { keyword: $scope.keyword } ).then( function(response) {
				$scope.showsuggestions = true;
				$scope.suggestions = response.data;
			});
		}, 200 );
	}

	$scope.fillsearch = function( name ) {
		$location.path('/supplement/' + name );
		$scope.keyword = "";
		$scope.showsuggestions = false;
	}
});
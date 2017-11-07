angular.module('SearchCtrl', []).controller('SearchController', function($scope, $http, $routeParams, $location) {
	$scope.headline = "";
	$scope.$parent.loading = true;
	$scope.noResult = false;

	$scope.$parent.seo = {
		title: "Search Suppliments",
		desc: "Search Suppliments by sub categories or keywords",
		image: "",
		image_width: 50,
		image_height: 50,
		url: location.href
	}

	$scope.$on('$routeChangeSuccess', function() {
		var action = { url: "", params: {} };

		if ( $routeParams.category && $routeParams.subcategory ) {
			action.url = "get-supplements-by-subcategory";
			action.params.category = $routeParams.category;
			action.params.subcategory = $routeParams.subcategory;
			$scope.headline = "Search by Topic : " + $routeParams.subcategory;
		}
		else if ( $routeParams.category ) {
			action.url = "get-supplements-by-category";
			action.params.category = $routeParams.category;
			$scope.headline = "Search by Topic : " + $routeParams.category;
		}
		else if ( $routeParams.keyword ) {
			action.url = "get-supplements-by-keyword";
			action.params.keyword = $routeParams.keyword;
			$scope.headline = "Search by Keyword : " + $routeParams.keyword;
		}

		$http.post( action.url, action.params ).then( function(response) {
			$scope.supplements = response.data;
			$scope.chunckedSupplements = chunk( $scope.supplements, 4 );

			if ( response.data.length == 0 )
				$scope.noResult = true;
			
			$scope.$parent.loading = false;
		});
	} );

	$scope.openSupplement = function( name ) {
		$location.path('/supplement/' + name)
	}

	function chunk( arr, size ) {
		var newArr = [];
		for (var i=0; i<arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	}
});
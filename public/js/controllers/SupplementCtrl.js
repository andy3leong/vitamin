angular.module('SupplementCtrl', ['ngCookies']).controller('SupplementController', function($scope, $http, $routeParams, $cookies) {
	$scope.$parent.loading = true;

	$scope.colorMap = {
		Muscle		: "red",
		Mind 		: "blue",
		Mood 		: "purp",
		Condition 	: "yellow",
		Boost		: "green"
	}
	$scope.faved = "";

	$scope.bestMatch = null;
	$scope.bestSeller = null;
	$scope.bestValue = null;

	var restricted = {
		'modafinil': {
			'wiki': 'https://en.wikipedia.org/wiki/Modafinil',
			'suppliername': 'ModafinilCat',
			'link': 'https://www.modafinilcat.com/modafinil-modalert-200?a=vtmn',
		},
		'marijuana': {
			'wiki': 'https://en.wikipedia.org/wiki/Cannabis_(drug)#Marijuana',
			'suppliername': 'I Love Growing',
			'link': 'http://www.ilovegrowingmarijuana.com/2068.html',
		},
		'piracetam': {
			'wiki': 'https://en.wikipedia.org/wiki/Piracetam',
			'suppliername': 'Blue Brain Boost',
			'link': 'https://www.bluebrainboost.com/p/phenylpiracetam/nootropics/20',
		},
		'oxiracetam': {
			'wiki': 'https://en.wikipedia.org/wiki/Oxiracetam',
			'suppliername': 'Blue Brain Boost',
			'link': 'https://www.bluebrainboost.com/nootropics/20',
		},
		'pramiracetam': {
			'wiki': 'https://en.wikipedia.org/wiki/Pramiracetam',
			'suppliername': 'Blue Brain Boost',
			'link': 'https://www.bluebrainboost.com/nootropics/20',
		},
		'adrafinil': {
			'wiki': 'https://en.wikipedia.org/wiki/Adrafinil',
			'suppliername': 'Blue Brain Boost',
			'link': 'https://www.bluebrainboost.com/p/adrafinil/nootropics/20',
		},
		'aniracetam': {
			'wiki': 'https://en.wikipedia.org/wiki/Aniracetam',
			'suppliername': 'Blue Brain Boost',
			'link': 'https://www.bluebrainboost.com/p/aniracetam/nootropics/20',
		},
		'noopept': {
			'wiki': 'https://en.wikipedia.org/wiki/Noopept',
			'suppliername': 'Blue Brain Boost',
			'link': 'https://www.bluebrainboost.com/p/noopept/nootropics/20',
		},
	}

	$scope.restrictedItem = null;

	$scope.$on('$routeChangeSuccess', function() {
		$http.post( '/get-supplement', {name: $routeParams.supplementname} ).then( function(response) {
			$scope.supplement = response.data;

			var temp = {
				Muscle		: [],
				Mind 		: [],
				Mood 		: [],
				Condition 	: [],
				Boost		: []
			};

			for( var i in response.data.clinical ) {
				var topic = getTopicFromSubtopic( response.data.clinical[i].topic );
				if ( topic == '' ) continue;

				temp[topic] = temp[topic] || [];
				temp[topic].push( response.data.clinical[i] );
			}

			$scope.effects = temp;

			$scope.supplement.views = $scope.supplement.views || 0;
			$scope.supplement.views = $scope.supplement.views + 1;

			$scope.favs = $scope.supplement.favs || 0;

			function getTopicFromSubtopic( subTopic ) {
				var effs = $scope.$parent.categories;
				for( var p in effs ) {
					var indexof = -1;
					for ( var i in effs[p] ) {
						if ( effs[p][i] == subTopic ) {
							indexof = i; break;
						}
					}

					if ( indexof != -1 ) {
						return p
					}
				}

				console.log( "missing subTopic: " + subTopic );
				return "";
			}

			if ( $cookies.get('faved'+$scope.supplement._id) == $scope.supplement._id ) { $scope.faved = "-red"; }

			$scope.$parent.loading = false;
		});

		if ( Object.keys( restricted ).indexOf( $routeParams.supplementname.toLowerCase() ) >= 0 ) {
			$scope.restrictedItem = restricted[$routeParams.supplementname.toLowerCase()];
		}
		else {
			$http.post( '/get-reviews', {name: $routeParams.supplementname, type: 'sale-flag'} ).then( function(response) {
				$scope.bestMatch = response.data;
			});
			$http.post( '/get-reviews', {name: $routeParams.supplementname, type: 'pricerank'} ).then( function(response) {
				$scope.bestValue = response.data;
			});
			$http.post( '/get-reviews', {name: $routeParams.supplementname, type: 'salesrank'} ).then( function(response) {
				$scope.bestSeller = response.data;
			});
		}

		$http.post( '/add-views', {name: $routeParams.supplementname} ).then( function(response) {} );
		
		$scope.$parent.seo = {
			title: $scope.supplement.name,
			desc: $scope.supplement.lede,
			image: "http://vitamn.herokuapp.com/products/" + encodeURI( $scope.supplement.name ) + ".jpg",
			image_width: 50,
			image_height: 50,
			url: location.href
		}
	});

	$scope.favorite = function( id ) {
		if ( $cookies.get('faved'+id) != id ) {
			$cookies.put('faved'+id, id);
			$scope.favs = $scope.favs + 1;
			$scope.faved = "-red";

			$http.post( '/add-favs', {id: id} ).then( function(response) {
				
			} );
		}
	}
});
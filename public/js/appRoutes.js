angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		.when('/search/:category/:subcategory?', {
			templateUrl: 'views/search.html',
			controller: 'SearchController'
		})
		.when('/searchkeyword/:keyword', {
			templateUrl: 'views/search.html',
			controller: 'SearchController'
		})
		.when('/supplement/:supplementname', {
			templateUrl: 'views/supplement.html',
			controller: 'SupplementController'	
		})
		.when('/about', {
			templateUrl: 'views/about.html'	
		})
		.when('/privacy', {
			templateUrl: 'views/privacy.html'
		})
		.when('/terms', {
			templateUrl: 'views/terms.html'
		});

	$locationProvider.html5Mode(true).hashPrefix('*');

}]);
angular.module('Waterscan').config(function ($routeProvider) {

    $routeProvider.when('/home', {
        templateUrl: 'assets/partials/add.html'
    }).when('/results', {
        templateUrl: 'assets/partials/results.html',
        // controller: 'ResultsController'
        controller: 'TakenSampleController'
    }).when('/input', {
        templateUrl: 'assets/partials/takenSampleInput.html',
        controller: 'TakenSampleController'
    }).otherwise({
        redirectTo: '/home/'
    });
//    Add more routes
});

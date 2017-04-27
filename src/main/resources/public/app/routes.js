angular.module('Waterscan').config(function ($routeProvider) {

    $routeProvider.when('/home', {
        templateUrl: 'assets/partials/add.html'
    }).when('/test', {
        templateUrl: 'assets/partials/test.html',
        controller: 'TestController'
    }).when('/results', {
        templateUrl: 'assets/partials/results.html',
        controller: 'TakenSampleController'
    }).when('/input', {
        templateUrl: 'assets/partials/InputScreen.html',
        controller: 'InputController'
    }).otherwise({
        redirectTo: '/home/'
    });



//    Add more routes
});

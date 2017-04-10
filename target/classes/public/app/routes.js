angular.module('waterscan').config(function ($routeProvider) {

    $routeProvider.when('/test', {
        templateUrl: 'assets/partials/testPartial.html',
        controller: 'TestController'
    });

//    Add more routes
});
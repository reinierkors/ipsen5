angular.module('waterscan').config(function ($routeProvider) {

    $routeProvider.when('/test', {
        templateUrl: 'assets/partials/add.html',
        controller: 'TestController'
    });

//    Add more routes
});

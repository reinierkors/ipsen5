angular.module('waterscan').config(function ($routeProvider) {

    $routeProvider.when('/test', {
        templateUrl: 'assets/partials/testPartial.html',
        controller: 'TestController'
    });

    $routeProvider.when('/input', {
        templateUrl: 'assets/partials/testDataInputScreen.html',
        controller: 'InputController'
    })

//    Add more routes
});

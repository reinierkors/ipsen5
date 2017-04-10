angular.module('waterscan').config(function ($routeProvider) {

    $routeProvider.when('/test', {
        templateUrl: 'assets/partials/add.html',
        controller: 'TestController'
    });

    $routeProvider.when('/input', {
        templateUrl: 'assets/partials/testDataInputScreen.html',
        controller: 'testDataInputScreenController'
    })

//    Add more routes
});

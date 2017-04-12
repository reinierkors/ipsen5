angular.module('waterscan').config(function ($routeProvider) {

    $routeProvider.when('/test', {
        templateUrl: 'assets/partials/testPartial.html',
        controller: 'TestController'
    }).when('/source', {
        templateUrl: 'assets/partials/sourceDataOverview.html',
        controller: 'TaxonController'
    });

//    Add more routes
});

/**
 * Created by Marijn on 12-4-2017.
 */
angular.module('Waterscan').controller('MenuController', function ($scope, $mdSidenav) {
    $scope.title = "Waterscan";
    $scope.toggleMenu = function () {
        $mdSidenav('left').toggle();
    };
    $scope.sections = [
        {
            title: "Home", url: "/home",
            icon: "home"
        }, {
            title: "Invoer", url: "/input"
        }, {
            title: "Resultaten", url: "/results"
        }
    ];
});

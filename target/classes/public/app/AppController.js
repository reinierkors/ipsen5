angular.module('waterscan').controller('AppController', function($scope, $location) {

    $scope.goToTest = function() {
        $location.path('/test');
    };

    $scope.goToInputScreen = function() {
        $location.path('/input');
    };
});

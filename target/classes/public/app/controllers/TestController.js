angular.module('waterscan').controller('TestController', function ($scope, TestService) {
    var self = this;

    TestService.getTest(function (data) {
        var testModel = angular.fromJson(data);
        console.log(testModel)
    })
});
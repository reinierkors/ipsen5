angular.module('Waterscan').controller('TestController', function ($scope, TestService) {
    var self = this;

    TestService.getTest(function (data) {
        var testModel = angular.fromJson(data);
        console.log(testModel);
        swal(
            testModel.name,
            testModel.gender,
            'success'
        )
    })
});

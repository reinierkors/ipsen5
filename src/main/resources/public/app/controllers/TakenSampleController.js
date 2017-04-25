angular.module('Waterscan').controller('TakenSampleController', function ($scope, TakenSampleService) {
    var self = this;

    TakenSampleService.retrieveAll(function (data) {
       var takenSamples = angular.fromJson(data);
       console.log(takenSamples);
    });

    TakenSampleService.retrieveAllTemp(function (data) {
        var takenSamplesTemp = angular.fromJson(data);
        console.log(takenSamplesTemp);
    })
});
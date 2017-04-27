angular.module('Waterscan').controller('TakenSampleController', function ($scope, TakenSampleService) {
    var self = this;

    $scope.file = File;

    $scope.uploadFile = function (file) {
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function (e) {
            var data = $.csv.toObjects(e.target.result);
            console.log(data.length);
            var i = data.length;
            while(i > 0) {
                TakenSampleService.uploadFile(angular.toJson(data[i]));
                i -= 1;
            }
        };
        r.readAsBinaryString(f);
    };

    TakenSampleService.retrieveAll(function (data) {
        var takenSamples = angular.fromJson(data);
        console.log(takenSamples);
    });

    TakenSampleService.retrieveAllTemp(function (data) {
        var takenSamplesTemp = angular.fromJson(data);
        console.log(takenSamplesTemp);
    });

    // self.processFile = function (file) {
    //     var allTextLines = file.split(/\r\n|\n/);
    //     var headers = allTextLines[0].split(';');
    //     var lines = [];
    //
    //     for (var i=1; i<allTextLines.length; i++) {
    //         var data = allTextLines[i].split(';');
    //         if (data.length === headers.length) {
    //
    //             var tarr = [];
    //             for (var j=0; j<headers.length; j++) {
    //                 tarr.push(headers[j]+":"+data[j]);
    //             }
    //             lines.push(tarr);
    //         }
    //     }
    //     console.log(lines);
    // }
});
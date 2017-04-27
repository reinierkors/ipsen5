angular.module('Waterscan').service('TakenSampleService', function ($http) {
    var self = this;

    self.retrieveAll = function (onRetrieved) {
        var url = '/samples';
        $http.get(url).then(function (response) {
                onRetrieved(response.data);
            },
            function (response) {
                console.log("Ophalen mislukt", response.data, "error");
                swal(
                    'Ophalen van samples is mislukt',
                    response.data,
                    'error'
                )
            });
    };

    self.retrieveAllTemp = function (onRetrieved) {
        var url = '/samples/temp';
        $http.get(url).then(function (response) {
                onRetrieved(response.data);
            },
            function (response) {
                console.log("Ophalen mislukt", response.data, "error");
                swal(
                    'Ophalen van samples is mislukt',
                    response.data,
                    'error'
                )
            });
    };

    self.uploadFile = function (file) {
        var uri = '/samples/insert';

        $http.post(uri, file).then(function (response) {
            console.log(response.data);
        })
    };
});
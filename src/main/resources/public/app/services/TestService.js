angular.module('waterscan').service('TestService', function ($http) {
    var self = this;

    self.getTest = function (onRetrieved) {
        var url = '/test';
        $http.get(url).then(function (response) {
                onRetrieved(response.data);
            },
            function (response) {
                console.log("Ophalen mislukt", response.data, "error");
            });
    };
});
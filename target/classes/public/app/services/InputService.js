/**
 * Created by Kruishoop on 10-4-2017.
 */
angular.module('waterscan').service('InputService', function ($http) {
    var self = this;

    self.getTest = function (onRetrieved) {
        var url = '/input';
        $http.get(url).then(function (response) {
                onRetrieved(response.data);
            },
            function (response) {
                console.log("Ophalen mislukt", response.data, "error");
            });
    };
});
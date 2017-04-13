angular.module('waterscan').service('TaxonService', function ($http) {
    var self = this;

    self.getAllTaxonData = function (onRetrieved) {
        var url = '/sourcetest';
        $http.get(url).then(function (response) {
                onRetrieved(response.data);
            },
            function (response) {
                console.log("Ophalen mislukt", response.data, "error");
                swal(
                    'Ophalen van taxons is mislukt',
                    '',
                    'error'
                )
            });
    };
});
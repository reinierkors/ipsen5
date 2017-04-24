angular.module('waterscan').controller('TaxonController', function ($scope, TaxonService) {
    var self = this;

    TaxonService.getAllTaxonData(function (data) {
        var taxons = angular.fromJson(data);
        console.log(taxons);
    })
});
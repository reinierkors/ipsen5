/**
 * Created by Marijn on 26-4-2017.
 */

angular.module('Waterscan').controller('ResultsController', function ($scope, TakenSampleService) {
    var self = this;

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    TakenSampleService.retrieveAllAverageSamples(function (data) {
        $scope.takenSamples = angular.fromJson(data);
        console.log($scope.takenSamples);

        //Eerste serie zijn de "resultaten" (nu vastgesteld), tweede serie is de referentie
        $scope.series = ['Resultaten', 'Referentie'];
        $scope.zout = [[$scope.takenSamples[0]['zoe'], $scope.takenSamples[0]['zzb'], $scope.takenSamples[0]['zb'], $scope.takenSamples[0]['mb'], $scope.takenSamples[0]['sbm']], [7.4, 1, 1, 0.6, 0]];
        $scope.diepte = [[2.3, 0.9, 2.8, 1.1, 1.9, 0.9], [2.0, 0.5, 3.5, 1.0, 2.0, 1.0]];
        $scope.droogval = [[7.0, 2.0, 1.0, 0.0, 0.0], [7.4, 2.3, 0.3, 0.0, 0.0]];
        $scope.oppervlak = [[2.1, 0.9, 0.5, 1.3, 0.5, 1.6, 1.1, 1.1, 0.8], [3.4, 1.4, 1.0, 1.3, 0.5, 1.2, 0.7, 0.2, 0.0]];
        $scope.saprobie = [[2.0, 5.0, 3.0, 0.0], [1.4, 5.3, 3.2, 0.1]];
        $scope.stroming = [[4.6, 1.8, 1.8, 0.9, 0.9], [4.5, 2.2, 1.8, 1.0, 0.6]];
        $scope.substraat = [[2.0, 2.0, 2.0, 0.0, 0.0, 2.0, 0.0, 0.0, 2.0, 0.0], [2.4, 1.6, 1.0, 1.0, 1.2, 0.8, 0.4, 0.2, 1.4, 0.0]];
        $scope.trofie = [[0.0, 0.0, 2.0, 4.0, 4.0], [0.0, 1.0, 2.3, 3.2, 3.5]];
        $scope.zuur = [[2.0, 3.0, 3.0, 2.0], [2.1, 2.7, 3.2, 2.0]];
    });

    //Labels voor de verschillende grafieken
    $scope.zoutLabels = ["Zoet", "Zeer Zwak Brak", "Zwak Brak", "Matig Brak", "Sterk Brak tot Marien"];
    $scope.diepteLabels = ["Zeer Ondiep Moerassig", "Zeer Ondiep Bron", "Ondiep Stilstaand", "Ondiep Stromend", "Diep Stilstaand", "Diep Stromend"];
    $scope.droogvalLabels = ["Permanent", "Semi Permanent", "Temporair 6wk - 3mnd", "Temporair 3mnd - 5mnd", "Temporair >5mnd"];
    $scope.oppervlakLabels = ["Zeer Klein", "Zeer Klein Geïsoleerd", "Zeer Klein Open", "Klein Geïsoleerd", "Klein Open", "Middelgroot Geïsoleerd", "Middelgroot Open", "Groot Geïsoleerd", "Groot Open"];
    $scope.saprobieLabels = ["Oligosaproob", "B-mesosaproob", "A-mesosaproob", "Polysaproob"];
    $scope.stromingLabels = ["Stilstaand", "Zeer langzaam stromend", "Langzaam stromend", "Matig stromend", "Snel stromend"];
    $scope.substraatLabels = ["Slib", "Klei & Leem", "Zand", "Grind", "Stenen", "Fijne Detritus", "Grove Detritus", "Hout", "Waterplanten", "Overig"];
    $scope.trofieLabels = ["Oligotroof", "Meso-oligotroof", "Mesotroof", "Meso-eutroof", "Eutroof"];
    $scope.zuurLabels = ["Zuur", "Zwak Zuur", "Neutraal", "Basisch"];

    $scope.options = {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max: 10}}]
        },
        legend: {
            display: true
        }
    };
});

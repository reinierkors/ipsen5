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
        $scope.diepte = [[$scope.takenSamples[0]['zoi'], $scope.takenSamples[0]['zor'], $scope.takenSamples[0]['oi'], $scope.takenSamples[0]['or'], $scope.takenSamples[0]['di'], $scope.takenSamples[0]['dr']], [2.0, 0.5, 3.5, 1.0, 2.0, 1.0]];
        $scope.droogval = [[$scope.takenSamples[0]['pe'], $scope.takenSamples[0]['sp'], $scope.takenSamples[0]['tLesserThan3'], $scope.takenSamples[0]['t3Minus5'], $scope.takenSamples[0]['tBiggerThan5']], [7.4, 2.3, 0.3, 0.0, 0.0]];
        $scope.oppervlak = [[$scope.takenSamples[0]['zka'], $scope.takenSamples[0]['zki'], $scope.takenSamples[0]['zko'], $scope.takenSamples[0]['kli'], $scope.takenSamples[0]['klo'], $scope.takenSamples[0]['mi'], $scope.takenSamples[0]['mo'], $scope.takenSamples[0]['gi'], $scope.takenSamples[0]['go']], [3.4, 1.4, 1.0, 1.3, 0.5, 1.2, 0.7, 0.2, 0.0]];
        $scope.saprobie = [[$scope.takenSamples[0]['os'], $scope.takenSamples[0]['bms'], $scope.takenSamples[0]['ams'], $scope.takenSamples[0]['ps']], [1.4, 5.3, 3.2, 0.1]];
        $scope.stroming = [[$scope.takenSamples[0]['sti'], $scope.takenSamples[0]['zls'], $scope.takenSamples[0]['ls'], $scope.takenSamples[0]['ms'], $scope.takenSamples[0]['ss']], [4.5, 2.2, 1.8, 1.0, 0.6]];
        $scope.substraat = [[$scope.takenSamples[0]['sl'], $scope.takenSamples[0]['kl'], $scope.takenSamples[0]['za'], $scope.takenSamples[0]['gr'], $scope.takenSamples[0]['st'], $scope.takenSamples[0]['fd'], $scope.takenSamples[0]['gd'], $scope.takenSamples[0]['ho'], $scope.takenSamples[0]['wp'], $scope.takenSamples[0]['ov']], [2.4, 1.6, 1.0, 1.0, 1.2, 0.8, 0.4, 0.2, 1.4, 0.0]];
        $scope.trofie = [[$scope.takenSamples[0]['ot'], $scope.takenSamples[0]['mot'], $scope.takenSamples[0]['mt'], $scope.takenSamples[0]['met'], $scope.takenSamples[0]['eut']], [0.0, 1.0, 2.3, 3.2, 3.5]];
        $scope.zuur = [[$scope.takenSamples[0]['zu'], $scope.takenSamples[0]['zwz'], $scope.takenSamples[0]['ne'], $scope.takenSamples[0]['ba']], [2.1, 2.7, 3.2, 2.0]];
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

/**
 * Created by Marijn on 26-4-2017.
 */

angular.module('Waterscan').controller('ResultsController', function ($scope) {
    var self = this;

    $scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.series = ['Series A'];
    $scope.data = [
        [200, 167, 18, 120, 100, 130, 130, 120, 140, 60, 200, 260]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.options = {
        title: {
            display: true,
            text: 'Amount of Pink stuff in the warehouse',
            fontSize: 16
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    };
    $scope.values = [{
        "name": "Set 1",
        "zoet": [9, 1, 0, 0, 0],
        "zoe": 10,
        "zzb": 0,
        "zb": 0,
        "mb": 0,
        "sbm": 0
    }, {"name": "Set 2", "zoet": [9, 1, 0, 0, 0], "zoe": 9, "zzb": 1, "zb": 0, "mb": 0, "sbm": 0}];
    $scope.zoetData = [[9, 1, 0, 0, 0]];
    $scope.zoetLabels = ["Zoet", "Zeer Zwak Brak", "Zwak Brak", "Matig Brak", "Sterk Brak"];
    $scope.zoetSeries = ['Set 1'];
    $scope.zoetOptions = {
        responsive: false,
        maintainAspectRatio: false
    }
});
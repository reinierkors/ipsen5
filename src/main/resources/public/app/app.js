(function () {

    var app = angular.module('Waterscan', [
        'ngCookies',
        'ngMaterial',
        'ngResource',
        'ngSanitize',
        'ngRoute'
    ]);

    app.config(function ($mdThemingProvider) {
       $mdThemingProvider
           .theme('default')
           .primaryPalette('grey')
           .accentPalette('red')
           .warnPalette('red')
           .backgroundPalette('blue');
    });

    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.baseHref = '/';
    });

    app.run(['$route', function ($route) {
        $route.reload();
    }]);

    //Init
    addScript("app/AppController.js");

    //Controllers
    addScript("app/controllers/MenuController.js");
    addScript("app/controllers/TakenSampleController.js");
    addScript("app/controllers/InputController.js");

    //Services
    addScript("app/services/TakenSampleService.js");
    addScript("app/services/InputService.js");

    addScript("app/routes.js");

    function addScript(url) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
    }
})();

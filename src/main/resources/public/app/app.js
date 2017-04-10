(function () {

    var app = angular.module('waterscan', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute'
    ]);

    //Init
    addScript("app/AppController.js");

    //Test
    addScript("app/controllers/TestController.js");
    addScript("app/services/TestService.js");

    addScript("app/routes.js");

    function addScript(url) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
    }
})();
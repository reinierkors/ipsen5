(function () {
    addScript("assets/libraries/jquery-3.2.0.min.js");
    addScript("assets/libraries/angularjs/angular.js");
    addScript("assets/libraries/angularjs/angular-route.js");
    addScript("assets/libraries/angularjs/angular-cookies.js");
    addScript("assets/libraries/angularjs/angular-sanitize.js");
    addScript("assets/libraries/angularjs/angular-resource.js");
    addScript("assets/libraries/angularjs/angular-messages.js");
    addScript("assets/libraries/angularjs/angular-aria.js");
    addScript("assets/libraries/angularjs/angular-animate.js");
    addScript("https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.js");
    addScript("assets/libraries/swal/sweetalert2.min.js");
    addScript("assets/libraries/chart/Chart.bundle.min.js");

    function addScript(url) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
    }
})();

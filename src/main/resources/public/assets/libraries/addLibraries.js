(function () {
    addScript("assets/libraries/jquery-3.2.0.min.js");
    addScript("assets/libraries/angularjs/angular.min.js");
    addScript("assets/libraries/angularjs/angular-route.min.js");
    addScript("assets/libraries/angularjs/angular-cookies.min.js");
    addScript("assets/libraries/angularjs/angular-sanitize.min.js");
    addScript("assets/libraries/angularjs/angular-resource.min.js");
    addScript("assets/libraries/swal/sweetalert2.min.js");

    function addScript(url) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
    }
})();
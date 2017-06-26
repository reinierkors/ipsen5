import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import config.Config;

import api.ApiException;
import api.ApiExceptionTypeAdapter;
import api.ApiGuard;

import authenticate.AuthRouter;
import calculate.CalculateRouter;
import location.LocationRouter;
import marker.MarkerRouter;
import reference.ReferenceRouter;
import sample.SampleRouter;
import taxon.TaxonRouter;
import users.UserRouter;
import waterschap.WaterschapRouter;
import watertype.WatertypeRouter;
import wew.WEWRouter;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        //Set the API server up
        port(Config.getInstance().api.port);
        ipAddress(Config.getInstance().api.host);
        enableCORS("*", null, "X-Authorization, User-Role");

        //Take care if 404s, 500s and exceptions
        handleErrors();

        //Used for permission checking
        ApiGuard apiGuard = new ApiGuard();

        //Put all API calls under /api and let package routers handle their own routes
        path("/api", () -> {
            //Check authorization
            before("/*", (request, response) -> {
                if (request.url().contains("login")) {
                    return;
                }
                if (request.requestMethod().contains("OPTIONS")) {
                    return;
                }
                if (!apiGuard.authCheck(request.headers("X-Authorization"))) {
                    System.out.println("Request halted");
                    halt(401, "Your session has expired");
                }
            });
            // Checks if user is an admin if the request is directed at an admin path
            before("/*/admin/*", ((request, response) -> {
                apiGuard.adminBeforeCheck(request);
            }));

            new AuthRouter();
            new SampleRouter();
            new TaxonRouter();
            new WEWRouter();
            new LocationRouter();
            new UserRouter();
            new WaterschapRouter();
            new WatertypeRouter();
            new CalculateRouter();
            new MarkerRouter();
            new ReferenceRouter();
        });
    }

    //What to do with what kind of error
    private static void handleErrors() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(ApiException.class, new ApiExceptionTypeAdapter());
        Gson gson = gsonBuilder.create();

        //Turn 404 and 500 errors into json
        notFound((req, res) -> {
            res.type("application/json");
            return gson.toJson(new ApiException("404 Not Found"));
        });
        internalServerError((req, res) -> {
            res.type("application/json");
            return gson.toJson(new ApiException("500 Server Error"));
        });

        //Handle ApiException
        exception(ApiException.class, (exception, req, res) -> {
            res.status(500);
            res.body(gson.toJson(exception));
        });

        //ToDo: we shouldn't print java exception messages to the client
        exception(IllegalArgumentException.class, (e, req, res) -> {
            res.status(400);
            res.body(gson.toJson("An error occurred: " + e));
        });
    }

    // Enables CORS on requests. This method is an initialization method and should be called once.
    private static void enableCORS(final String origin, final String methods, final String headers) {

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Note: this may or may not be necessary in your particular application
            response.type("application/json");
        });
    }
}

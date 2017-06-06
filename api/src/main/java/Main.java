import api.ApiException;
import api.ApiExceptionTypeAdapter;
import api.ApiGuard;
import authenticate.AuthRouter;
import config.Config;
import location.LocationRouter;
import sample.SampleRouter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import speciesCategory.SpeciesCategoryRouter;
import species.SpeciesRouter;
import users.UserRouter;
import waterschap.WaterschapRouter;
import watertype.WatertypeRouter;
import wew.WEWRouter;

import static spark.Spark.*;

public class Main {
	public static void main(String[] args) {
		port(Config.getInstance().api.port);
		ipAddress(Config.getInstance().api.host);
		enableCORS("*",null,"X-Authorization");
		
		//Handle ApiException
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(ApiException.class,new ApiExceptionTypeAdapter());
		Gson gson = gsonBuilder.create();
		exception(ApiException.class, (exception,req,res)-> {
			res.status(500);
			res.body(gson.toJson(exception));
		});
		
		//Turn 404 and 500 errors into json
		notFound((req,res) -> {
			res.type("application/json");
			return gson.toJson(new ApiException("404 Not Found"));
		});
		internalServerError((req,res) -> {
			res.type("application/json");
			return gson.toJson(new ApiException("500 Server Error"));
		});
		
        ApiGuard apiGuard = new ApiGuard();

        before("/api",(request, response) -> {
            if(!apiGuard.authCheck(request.headers("Authorization"))){
                halt(401, "Your session has expired");
            }
        });
		//Put all API calls under /api and let package routers handle their own routes
		path("/api",()->{
		    new AuthRouter();
			new SampleRouter();
			new SpeciesRouter();
			new SpeciesCategoryRouter();
			new WEWRouter();
			new LocationRouter();
			new WatertypeRouter();
			new UserRouter();
			new WaterschapRouter();
			new WatertypeRouter();

			exception(IllegalArgumentException.class, (e, req, res) -> {
				res.status(400);
				res.body(gson.toJson("An error occurred: " + e));
			});
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

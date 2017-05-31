import api.ApiException;
import api.ApiExceptionTypeAdapter;
import config.Config;
import location.LocationRouter;
import sample.SampleRouter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import speciesCategory.SpeciesCategoryRouter;
import species.SpeciesRouter;
import users.UserRouter;
import waterschap.WaterschapRouter;
import wew.WEWRouter;

import static spark.Spark.*;

public class Main {
	public static void main(String[] args) {
		port(Config.getInstance().api.port);
		ipAddress(Config.getInstance().api.host);
		enableCORS("*",null,null);
		
		//Handle ApiException
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(ApiException.class,new ApiExceptionTypeAdapter());
		Gson gson = gsonBuilder.create();
		exception(ApiException.class, (exception,req,res)-> {
			res.status(500);
			res.body(gson.toJson(exception));
		});
		
		//Put all API calls under /api and let package routers handle their own routes
		path("/api",()->{
			new SampleRouter();
			new SpeciesRouter();
			new SpeciesCategoryRouter();
			new WEWRouter();
			new LocationRouter();
			new UserRouter();
			new WaterschapRouter();

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

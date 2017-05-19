import static spark.Spark.port;
import static spark.Spark.path;
import static spark.Spark.options;
import static spark.Spark.before;
import config.Config;
import sample.SampleRouter;

public class Main {
	public static void main(String[] args) {
		port(Config.getInstance().api.port);
		enableCORS("*",null,null);
		
		//Put all API calls under /api and let package routers handle their own routes
		path("/api",()->{
			new SampleRouter();
			//new WhateverRouter();
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

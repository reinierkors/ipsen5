import static spark.Spark.port;
import static spark.Spark.path;
import config.Config;
import sample.SampleRouter;

public class Main {
	public static void main(String[] args) {
		port(Config.getInstance().api.port);
		
		//Put all API calls under /api and let package routers handle their own routes
		path("/api",()->{
			new SampleRouter();
			//new WhateverRouter();
		});
		
	}
}

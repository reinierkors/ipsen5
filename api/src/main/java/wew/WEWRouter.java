package wew;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.path;

/**
 * Bevat de routes voor WEW-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWRouter {
	public WEWRouter(){
		WEWService wewService = WEWService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/wew", ()->{
		
		});
		
	}
}

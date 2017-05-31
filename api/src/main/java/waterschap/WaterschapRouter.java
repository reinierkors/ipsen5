package waterschap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import static spark.Spark.path;
import static spark.Spark.get;


/**
 * Bevat de routes voor waterschap-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.1, 30-5-2017
 */
public class WaterschapRouter {
	public WaterschapRouter(){
		WaterschapService waterschapService = WaterschapService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/waterschap", ()->{
			get("",(req,res) -> gson.toJson(waterschapService.getAll()));
			get("/",(req,res) -> gson.toJson(waterschapService.getAll()));
		});
		
	}
}

package sample;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import static spark.Spark.path;
import static spark.Spark.get;


/**
 * Bevat de routes voor sample-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.3, 21-5-2017
 */
public class SampleRouter {
	public SampleRouter(){
		SampleService sampleService = SampleService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/sample", ()->{
			get("/:id",(req,res) -> gson.toJson(sampleService.get(Integer.parseInt(req.params("id")))));
		});
		
	}
}

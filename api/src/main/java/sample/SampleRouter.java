package sample;

import static spark.Spark.path;
import static spark.Spark.get;

import com.google.gson.*;
import database.ConnectionManager;

/**
 * Bevat de routes voor sample-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.2, 19-5-2017
 */
public class SampleRouter {
	public SampleRouter(){
		SampleRepository repo = new SampleRepository(ConnectionManager.getInstance().getConnection());
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/sample", ()->{
			get("/:id",(req,res)-> gson.toJson(repo.get(Integer.parseInt(req.params("id")))));
		});
		
	}
}

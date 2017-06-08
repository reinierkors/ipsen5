package sample;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import static spark.Spark.path;
import static spark.Spark.get;
import static spark.Spark.post;


/**
 * Bevat de routes voor sample-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.3, 4-6-2017
 */
public class SampleRouter {
	public SampleRouter(){
		SampleService sampleService = SampleService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd").create();
		Gson gson = gsonBuilder.create();
		
		path("/sample", ()->{
			get("/:id",(req,res) -> gson.toJson(sampleService.get(Integer.parseInt(req.params("id")))));
			post("",(req,res) -> {
				Type listType = new TypeToken<List<Sample>>(){}.getType();
				List<Sample> samples = gson.fromJson(req.body(),listType);
				return gson.toJson(sampleService.save(samples));
			});
		});
		
	}
}

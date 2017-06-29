package sample;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import static spark.Spark.*;


/**
 * Contains the routes for sample parts of the API
 *
 * @author Wander Groeneveld, Dylan de Wit
 * @version 0.4, 27-6-2017
 */
public class SampleRouter{
	public SampleRouter(){
		SampleService sampleService = SampleService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		
		path("/sample", () -> {
			get("/getYears/", (req, res) -> gson.toJson(sampleService.getDistinctYears()));
			get("/recent/:count", (req, res) -> gson.toJson(sampleService.getRecent(Integer.parseInt(req.params("count")))));
			get("/getRelevant/:id", (req, res) -> gson.toJson(sampleService.getByLocationId(Integer.parseInt(req.params("id")))));
			get("/:id", (req, res) -> gson.toJson(sampleService.get(Integer.parseInt(req.params("id")))));
			post("", (req, res) -> {
				Type listType = new TypeToken<List<Sample>>(){
				}.getType();
				List<Sample> samples = gson.fromJson(req.body(), listType);
				return gson.toJson(sampleService.save(samples));
			});
		});
		
		path("/admin/sample", () -> {
			post("/delete", (req, res) -> {
				int id = Integer.parseInt(req.body());
				return gson.toJson(sampleService.delete(id));
			});
		});
		
	}
}

package watertype;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.post;

/**
 * Routes for the watertype parts of the API
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.4, 1-6-2017
 */
public class WatertypeRouter {
	public WatertypeRouter(){
		WatertypeService watertypeService = WatertypeService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/watertype", ()->{
			get("",(req,res) -> gson.toJson(watertypeService.getAll()));
			get("/",(req,res) -> gson.toJson(watertypeService.getAll()));
			get("/:id", ((request, response) -> {
				int id = Integer.valueOf(request.params("id"));
				return gson.toJson(watertypeService.get(id));
			}));
			post("",(req,res) -> {
				Watertype watertype = gson.fromJson(req.body(),Watertype.class);
				return gson.toJson(watertypeService.save(watertype));
			});
		});
	}
}

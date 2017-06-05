package speciesCategory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.path;

/**
 * Bevat de routes voor species-category-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesCategoryRouter {
	public SpeciesCategoryRouter(){
		SpeciesCategoryService speciesCategoryService = SpeciesCategoryService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/speciesCategory", ()->{
			get("",(req,res) -> gson.toJson(speciesCategoryService.getAll()));
			get("/",(req,res) -> gson.toJson(speciesCategoryService.getAll()));
			get("/:id",(req,res) -> gson.toJson(speciesCategoryService.get(Integer.parseInt(req.params("id")))));
		});
		
	}
}

package species;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import static spark.Spark.path;
import static spark.Spark.get;

/**
 * Bevat de routes voor species-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesRouter {
	public SpeciesRouter(){
		SpeciesService speciesService = SpeciesService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/species", ()->{
			get("/:id",(req,res) -> gson.toJson(speciesService.get(Integer.parseInt(req.params("id")))));
		});
		
	}
}

package species;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;
import static spark.Spark.path;
import static spark.Spark.get;
import static spark.Spark.post;

/**
 * Bevat de routes voor species-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.3, 31-5-2017
 */
public class SpeciesRouter {
	public SpeciesRouter(){
		SpeciesService speciesService = SpeciesService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/species", ()->{
			get("/ids/:ids",(req,res) -> {
				List<Integer> ids = stream(req.params("ids").split(",")).map(Integer::parseInt).collect(Collectors.toList());
				return gson.toJson(speciesService.get(ids));
			});
			
			get("/:id",(req,res) -> gson.toJson(speciesService.get(Integer.parseInt(req.params("id")))));
			
			post("/findOrCreate",(req,res) -> {
				Type listType = new TypeToken<List<String>>(){}.getType();
				List<String> names = gson.fromJson(req.body(),listType);
				return gson.toJson(names.stream().map(speciesService::findOrCreate).collect(Collectors.toList()));
			});
			
			post("/find",(req,res) -> {
				Type listType = new TypeToken<List<String>>(){}.getType();
				List<String> names = gson.fromJson(req.body(),listType);
				return gson.toJson(names.stream().map(speciesService::find).filter(Objects::nonNull).collect(Collectors.toList()));
			});
			
			post("",(req,res) -> {
				Species species = gson.fromJson(req.body(),Species.class);
				return gson.toJson(speciesService.save(species));
			});
		});
	}
}

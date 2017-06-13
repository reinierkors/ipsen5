package taxon;

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
 * Contains routes for the taxon parts of the API
 *
 * @author Wander Groeneveld
 * @version 0.3, 31-5-2017
 */
public class TaxonRouter {
	public TaxonRouter(){
		TaxonService taxonService = TaxonService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/taxon", ()->{
			//Retrieve taxon by a comma seperated list of ids
			get("/ids/:ids",(req,res) -> {
				List<Integer> ids = stream(req.params("ids").split(",")).map(Integer::parseInt).collect(Collectors.toList());
				return gson.toJson(taxonService.get(ids));
			});
			
			//Retrieve a taxon by id
			get("/:id",(req,res) -> gson.toJson(taxonService.get(Integer.parseInt(req.params("id")))));
			
			//Retrieves taxon by names or creates them if they don't exist yet
			//Post data should be an array of strings (taxon names)
			post("/findOrCreate",(req,res) -> {
				Type listType = new TypeToken<List<String>>(){}.getType();
				List<String> names = gson.fromJson(req.body(),listType);
				return gson.toJson(names.stream().map(taxonService::findOrCreate).collect(Collectors.toList()));
			});
			
			//Retrieves taxon by names
			//Post data should be an array of strings (taxon names)
			//Taxon that are not found are omitted from the returned array
			post("/find",(req,res) -> {
				Type listType = new TypeToken<List<String>>(){}.getType();
				List<String> names = gson.fromJson(req.body(),listType);
				return gson.toJson(names.stream().map(taxonService::find).filter(Objects::nonNull).collect(Collectors.toList()));
			});
			
			//Save a new taxon and return it as object
			//Post data should represent a taxon object
			post("",(req,res) -> {
				Taxon taxon = gson.fromJson(req.body(), Taxon.class);
				return gson.toJson(taxonService.save(taxon));
			});
		});
	}
}

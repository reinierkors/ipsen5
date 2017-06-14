package taxon;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import taxon.group.TaxonGroup;
import taxon.level.TaxonLevel;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static spark.Spark.path;
import static spark.Spark.get;
import static spark.Spark.post;

/**
 * Contains routes for the taxon parts of the API
 *
 * @author Wander Groeneveld
 * @version 0.4, 13-6-2017
 */
public class TaxonRouter {
	public TaxonRouter(){
		TaxonService taxonService = TaxonService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/taxon", ()->{
			//Retrieve all taxa
			get("/all", (req, res) -> gson.toJson(taxonService.getAll()));
			
			//Retrieve taxa by a comma seperated list of ids
			post("/ids",(req,res) -> {
				Type listType = new TypeToken<List<Integer>>(){}.getType();
				List<Integer> ids = gson.fromJson(req.body(),listType);
				return gson.toJson(taxonService.get(ids));
			});
			
			//Retrieve a list of taxon-groups
			get("/group", (req,res) -> gson.toJson(taxonService.getGroups()));
			
			//Retrieve a list of taxon-levels
			get("/level", (req,res) -> gson.toJson(taxonService.getLevels()));
			
			//Retrieve a taxon by id
			get("/:id",(req,res) -> gson.toJson(taxonService.get(Integer.parseInt(req.params("id")))));
			
			//Saves a list of taxon-groups
			post("/group", (req,res) -> {
				Type listType = new TypeToken<List<TaxonGroup>>(){}.getType();
				List<TaxonGroup> groups = gson.fromJson(req.body(),listType);
				return gson.toJson(taxonService.saveGroups(groups));
			});
			
			//Saves a list of taxon-levels
			post("/level", (req,res) -> {
				Type listType = new TypeToken<List<TaxonLevel>>(){}.getType();
				List<TaxonLevel> levels = gson.fromJson(req.body(),listType);
				return gson.toJson(taxonService.saveLevels(levels));
			});
			
			//Retrieves taxa by names or creates them if they don't exist yet
			//Post data should be an array of strings (taxon names)
			post("/findOrCreate",(req,res) -> {
				Type listType = new TypeToken<List<String>>(){}.getType();
				List<String> names = gson.fromJson(req.body(),listType);
				return gson.toJson(names.stream().map(taxonService::findOrCreate).collect(Collectors.toList()));
			});
			
			//Retrieves taxa by names
			//Post data should be an array of strings (taxon names)
			//Taxon that are not found are omitted from the returned array
			post("/find",(req,res) -> {
				Type listType = new TypeToken<List<String>>(){}.getType();
				List<String> names = gson.fromJson(req.body(),listType);
				return gson.toJson(names.stream().map(taxonService::find).filter(Objects::nonNull).collect(Collectors.toList()));
			});
			
			//Save taxa and return them as objects
			//Post data should represent a list of taxon objects
			post("",(req,res) -> {
				Type listType = new TypeToken<List<Taxon>>(){}.getType();
				List<Taxon> taxa = gson.fromJson(req.body(),listType);
				return gson.toJson(taxonService.save(taxa));
			});
			
			//Save taxa and return them as objects, but find existing ones by name first
			//Post data should represent a list of taxon objects
			post("/merge",(req,res) -> {
				Type listType = new TypeToken<List<Taxon>>(){}.getType();
				List<Taxon> taxa = gson.fromJson(req.body(),listType);
				return gson.toJson(taxonService.saveMerge(taxa));
			});
			
		});
	}
}

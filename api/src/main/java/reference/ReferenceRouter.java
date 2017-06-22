package reference;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import static spark.Spark.*;


/**
 * Contains the routes for reference parts of the API
 *
 * @author Wander Groeneveld
 * @version 0.1, 19-6-2017
 */
public class ReferenceRouter {
	public ReferenceRouter(){
		ReferenceService referenceService = ReferenceService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd").create();
		Gson gson = gsonBuilder.create();
		
		path("/reference", ()->{
			get("",(req,res) -> gson.toJson(referenceService.getAll()));
			get("/:id",(req,res) -> gson.toJson(referenceService.get(Integer.parseInt(req.params("id")))));
		});
		
		path("/admin/reference", () -> {
			post("/delete/:id",(req,res) -> gson.toJson(referenceService.delete(Integer.parseInt(req.params("id")))));
			post("",(req,res) -> gson.toJson(referenceService.save(gson.fromJson(req.body(),Reference.class))));
		});
		
	}
}

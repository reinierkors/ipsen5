package wew;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import wew.value.WEWValue;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;
import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.post;

/**
 * Bevat de routes voor WEW-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.2, 6-6-2017
 */
public class WEWRouter {
	public WEWRouter(){
		WEWService wewService = WEWService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();
		
		path("/wew", ()->{
			get("/value/species/:ids", (req,res) -> {
				List<Integer> ids = stream(req.params("ids").split(",")).map(Integer::parseInt).collect(Collectors.toList());
				return gson.toJson(wewService.getBySpecies(ids));
			});
			get("/factor", (req,res) -> wewService.getFactors());
			
			post("/value", (req,res) -> {
				Type listType = new TypeToken<List<WEWValue>>(){}.getType();
				List<WEWValue> values = gson.fromJson(req.body(),listType);
				return gson.toJson(wewService.saveValues(values));
			});
			post("/factor", (req,res) -> {
				Type listType = new TypeToken<List<WEWService.WEWFactorWeb>>(){}.getType();
				List<WEWService.WEWFactorWeb> factors = gson.fromJson(req.body(),listType);
				return gson.toJson(wewService.saveFactors(factors));
			});
		});
		
	}
}

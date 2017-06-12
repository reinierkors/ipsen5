package calculate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.path;

/**
 * Contains routes regarding the calculations on samples and references
 *
 * @author Wander Groeneveld
 * @version 0.1, 9-6-2017
 */
public class CalculateRouter {
	public CalculateRouter(){
		CalculateService calculateService = CalculateService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd").create();
		Gson gson = gsonBuilder.create();
		
		path("/calculate", ()->{
			get("/sample/:id",(req,res) -> gson.toJson(calculateService.getBySample(Integer.parseInt(req.params("id")))));
		});
		
	}
}

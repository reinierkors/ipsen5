package waterschap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.*;


/**
 * Contains waterschap routes
 *
 * @author Wander Groeneveld, Dylan de Wit
 * @version 0.1, 30-5-2017
 */
public class WaterschapRouter{
	public WaterschapRouter(){
		WaterschapService waterschapService = WaterschapService.getInstance();

		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		Gson gson = gsonBuilder.create();

		path("/waterschap", () -> {
			get("", (req, res) -> gson.toJson(waterschapService.getAll()));
			get("/", (req, res) -> gson.toJson(waterschapService.getAll()));
			get("/:id", (req, res) -> gson.toJson(waterschapService.get(Integer.valueOf(req.params("id")))));
			post("/persist", ((request, response) -> {
				Waterschap waterschap = gson.fromJson(request.body(), Waterschap.class);
				return gson.toJson(waterschapService.save(waterschap));
			}));
		});

	}
}

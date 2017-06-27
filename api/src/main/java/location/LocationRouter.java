package location;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.post;

/**
 * Location router
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.3, 27-6-2017
 */
public class LocationRouter {
    public LocationRouter() {
        LocationService locationService = LocationService.getInstance();
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();

        path("/location", () -> {
            get("/all", ((request, response) -> gson.toJson(locationService.getAll())));
            get("/id/:id", ((request, response) -> gson.toJson(locationService.getById(Integer.valueOf(request.params("id"))))));
            get("/code/:code", (req,res) -> gson.toJson(locationService.getByCode(req.params("code"))));
            post("/ids", (req,res) -> {
	            Type listType = new TypeToken<List<Integer>>(){}.getType();
	            List<Integer> ids = gson.fromJson(req.body(), listType);
	            return gson.toJson(locationService.getByIds(ids));
            });
            post("",(req,res) -> {
                Location location = gson.fromJson(req.body(),Location.class);
                return gson.toJson(locationService.save(location));
            });
        });
    }
}

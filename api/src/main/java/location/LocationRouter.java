package location;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.post;

/**
 * Location router
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
 */
public class LocationRouter {
    public LocationRouter() {
        LocationService locationService = LocationService.getInstance();
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();

        path("/location", () -> {
            get("/all", ((request, response) -> gson.toJson(locationService.getAll())));
            get("/code/:code", (req,res) -> gson.toJson(locationService.getByCode(req.params("code"))));
            post("",(req,res) -> {
                Location location = gson.fromJson(req.body(),Location.class);
                return gson.toJson(locationService.save(location));
            });
        });
    }
}

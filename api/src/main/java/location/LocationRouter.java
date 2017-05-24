package location;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.path;

/**
 * Location router
 *
 * @author Dylan de Wit
 * @version 0.1, 24-5-2017
 */
public class LocationRouter {
    public LocationRouter() {
        LocationService locationService = LocationService.getInstance();
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();

        path("/location", () -> {
            get("/all", ((request, response) -> gson.toJson(locationService.getAll())));
        });
    }
}

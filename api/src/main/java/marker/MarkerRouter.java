package marker;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.path;
import static spark.Spark.post;

/**
 * @author Dylan de Wit
 * @version 1.0, 19-6-2017
 */
public class MarkerRouter {
    public MarkerRouter() {
        MarkerService markerService = MarkerService.getInstance();
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();

        path("/markers", () -> {
            post("/filter", ((request, response) -> {
                MarkerFilter filter = gson.fromJson(request.body(), MarkerFilter.class);
                return gson.toJson(markerService.getFilteredMarkers(filter));
            }));
        });
    }
}



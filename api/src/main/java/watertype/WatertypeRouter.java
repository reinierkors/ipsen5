package watertype;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.path;
import static spark.Spark.get;

/**
 * @author Dylan de Wit
 * @version 30-5-2017, 0.1
 */
public class WatertypeRouter {
    public WatertypeRouter() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();
        WatertypeService service = WatertypeService.getInstance();

        path("/watertype", () -> {
            get("/all", (((request, response) -> {
                return gson.toJson(service.getAll());
            })));
            get("/:id", ((request, response) -> {
                int id = Integer.valueOf(request.params("id"));
                return gson.toJson(service.get(id));
            }));
        });
    }
}

package resource;

import com.google.gson.Gson;
import service.TakenSampleService;

import static spark.Spark.get;
/**
 * Created by Dylan on 25-4-2017.
 */
public class TakenSampleResource {

    public TakenSampleResource(TakenSampleService service) {
        Gson gson = new Gson();

        get("/samples/temp", (request, response) ->
                gson.toJson(service.retrieveAllTemp()));

        get("/samples", (request, response) ->
                gson.toJson(service.retrieveAll()));

    }
}

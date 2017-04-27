package resource;

import com.google.gson.Gson;
import model.TakenSample;
import service.TakenSampleService;

import static spark.Spark.get;
import static spark.Spark.post;

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

        post("/samples/insert", ((request, response) -> {
            TakenSample sample = gson.fromJson(request.body(), TakenSample.class);
            service.insert(sample);
            return "ok";
        }));
    }
}

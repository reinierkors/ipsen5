package resource;

import com.google.gson.Gson;
import model.TestModel;
import service.Service;
import service.TestService;

import static spark.Spark.get;

public class TestResource {

    public TestResource(Service<TestModel> testService) {
        Gson gson = new Gson();

        get("/test", (req, response) -> {
            // process request
            return gson.toJson(testService.retrieveAll());
        });

        // more routes
    }
}
import com.google.gson.Gson;
import static spark.Spark.get;

public class TestResource {

    public TestResource(TestService testService) {
        Gson gson = new Gson();

        get("/test", (req, response) -> {
            // process request
            return gson.toJson(testService.getMeMahModel());
        });

        // more routes
    }
}
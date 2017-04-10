import resource.TestResource;
import service.Service;
import service.TestService;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(8080);
//        ipAddress("");
        externalStaticFileLocation("src/main/resources/public");

        new TestResource(new TestService());
    }
}
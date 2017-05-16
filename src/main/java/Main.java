import resource.TakenSampleResource;
import resource.TaxonResource;
import service.TakenSampleService;
import service.TaxonService;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(8080);
//        ipAddress("");
        externalStaticFileLocation("src/main/resources/public/src");

        get("/home", (req, response) -> "200 OK");

//        new TakenSampleResource(new TakenSampleService());
//        new TaxonResource(new TaxonService());
    }
}

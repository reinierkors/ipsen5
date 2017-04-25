import persistence.DatabaseAccess;
import persistence.TakenSampleDao;
import persistence.TaxonDao;
import resource.TakenSampleResource;
import resource.TaxonResource;
import resource.TestResource;
import service.Service;
import service.TakenSampleService;
import service.TaxonService;
import service.TestService;

import java.sql.SQLException;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(8080);
//        ipAddress("");
        externalStaticFileLocation("src/main/resources/public");

        get("/home", (req, response) -> "200 OK");

        new TakenSampleResource(new TakenSampleService());
        new TestResource(new TestService());
        new TaxonResource(new TaxonService());
    }
}

import static spark.Spark.get;
import static spark.Spark.port;

public class Main {
    public static void main(String[] args) {
        port(8080);
//        ipAddress("");
//        externalStaticFileLocation("src/main/resources/public/dist");

        get("/home", (req, response) -> "200 OK");

//        new TakenSampleResource(new TakenSampleService());
//        new TaxonResource(new TaxonService());
    }
}

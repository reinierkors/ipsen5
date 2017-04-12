import persistence.DatabaseAccess;
import persistence.TaxonDao;
import resource.TaxonResource;
import resource.TestResource;
import service.Service;
import service.TaxonService;
import service.TestService;

import java.sql.SQLException;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(8080);
//        ipAddress("");
        externalStaticFileLocation("src/main/resources/public");

        new TestResource(new TestService());
        new TaxonResource(new TaxonService());

        try {
            DatabaseAccess taxonDao = new TaxonDao();
            taxonDao.retrieveAll();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
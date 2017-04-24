package resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import model.Taxon;
import service.Service;

import static spark.Spark.get;


/**
 * Created by Dylan on 12-4-2017.
 */
public class TaxonResource {

    public TaxonResource(Service<Taxon> taxonService) {
        Gson gson = new Gson();

        get("/sourcetest", (req, response) -> {
            // process request
            return gson.toJson(taxonService.retrieveAll());
        });
    }
}

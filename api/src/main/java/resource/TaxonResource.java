package resource;

import com.google.gson.Gson;
import model.Taxon;
import service.Service;

import static spark.Spark.get;


/**
 * Created by Dylan on 12-4-2017.
 */
public class TaxonResource {

    public TaxonResource(Service<Taxon> taxonService) {
        Gson gson = new Gson();

        get("/sourcetest", (req, response) ->
                gson.toJson(taxonService.retrieveAll()));
    }
}

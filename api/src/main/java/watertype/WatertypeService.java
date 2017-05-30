package watertype;

import database.ConnectionManager;

/**
 * Created by Dylan on 30-5-2017.
 */
public class WatertypeService {

    private static final WatertypeService instance = new WatertypeService();
    private WatertypeRepository repository;
    private WatertypeService() {
        repository = new WatertypeRepository(ConnectionManager.getInstance().getConnection());
    }

    public WatertypeService getInstance() {
        return instance;
    }
}

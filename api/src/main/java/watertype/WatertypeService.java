package watertype;

import database.ConnectionManager;

/**
 * @author Dylan de Wit
 * @version 30-5-2017, 0.1
 */
public class WatertypeService {

    private static final WatertypeService instance = new WatertypeService();
    private WatertypeRepository repository;

    private WatertypeService() {
        repository = new WatertypeRepository(ConnectionManager.getInstance().getConnection());
    }

    public static WatertypeService getInstance() {
        return instance;
    }

    public Watertype get(int id) {
        return repository.get(id);
    }

    public Iterable<Watertype> getAll() {
        return repository.getAll();
    }
}

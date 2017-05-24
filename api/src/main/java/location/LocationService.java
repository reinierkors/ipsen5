package location;

import database.ConnectionManager;

/**
 * Location service
 *
 * @author Dylan de Wit
 * @version 0.1, 24-5-2017
 */
public class LocationService {
    private static final LocationService instance = new LocationService();
    private final LocationRepository repository;

    private LocationService() {
        repository = new LocationRepository(ConnectionManager.getInstance().getConnection());
    }

    public static LocationService getInstance() {
        return instance;
    }

    public Iterable<Location> getAll() {
        return repository.getAll();
    }
}

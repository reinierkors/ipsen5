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
    private CoordinateConverter converter;

    private LocationService() {
        repository = new LocationRepository(ConnectionManager.getInstance().getConnection());
        converter = new CoordinateConverter();
    }

    public static LocationService getInstance() {
        return instance;
    }

    public Iterable<Location> getAll() {
        Iterable<Location> locations = repository.getAll();
        for (Location location : locations) {
            Double[] coordinates = converter.convertToLatLng(location.getxCoord(),
                    location.getyCoord());
            location.setLatitude(coordinates[0]);
            location.setLongitude(coordinates[1]);
        }
        return locations;
    }
}

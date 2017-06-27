package location;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.List;

/**
 * Location service
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
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

    /**
     * Retrieve all locations
     *
     * @return Iterable object of locations
     */
    public Iterable<Location> getAll() {
        Iterable<Location> locations = repository.getAll();
        addLatLng(locations);
        return locations;
    }
    
    public List<Location> getByIds(List<Integer> ids) {
        List<Location> locations = repository.get(ids);
        addLatLng(locations);
        return locations;
    }
    
    private void addLatLng(Iterable<Location> locations) {
        for (Location location : locations) {
            converter.convertToLatLng(location);
        }
    }
    
    /**
     * Retrieve the location by location code
     *
     * @param code unique location coe
     * @return Location object
     * @throws ApiException when there was a problem retrieving the location, or the location does not exist
     */
    public Location getByCode(String code) throws ApiException {
        try {
            Location location = repository.findByCode(code);
            if (location == null) {
                throw new ApiException("Location does not exist");
            }
            return location;
        } catch (RepositoryException e) {
            throw new ApiException("Cannot retrieve location");
        }
    }

    /**
     * Store the location
     *
     * @param location the location object to store
     * @return the location object after it is stored
     * @throws ApiException when there's a problem storing the location
     */
    public Location save(Location location) throws ApiException {
        try {
            repository.persist(location);
            return location;
        } catch (RepositoryException e) {
            throw new ApiException("Cannot save location");
        }
    }

    /**
     * Retrieve the location with a specific ID
     *
     * @param id the id of the location to retrieve
     * @return the location with the specified id
     */
    public Location getById(int id) {
        Location location = repository.get(id);
        converter.convertToLatLng(location);
        return location;
    }

    public List<Location> getByFilters(Integer watertypeId, Integer waterschapId, String date) {
        List<Location> locations = repository.getByFilters(watertypeId, waterschapId, date);
        addLatLng(locations);
        return locations;
    }
}

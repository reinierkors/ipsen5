package location;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

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
    
    public Location getByCode(String code) throws ApiException {
    	try{
		    Location location = repository.findByCode(code);
		    if(location==null){
		    	throw new ApiException("Location does not exist");
		    }
		    return location;
	    } catch(RepositoryException e){
		    throw new ApiException("Cannot retrieve location");
	    }
    }
    
	public Location save(Location location) throws ApiException{
		try {
			repository.persist(location);
			return location;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save location");
		}
	}

    public Location getById(int id) {
        Location location = repository.get(id);
        Double[] coordinates = converter.convertToLatLng(location.getxCoord(),
                location.getyCoord());
        location.setLatitude(coordinates[0]);
        location.setLongitude(coordinates[1]);
        return location;
    }
}

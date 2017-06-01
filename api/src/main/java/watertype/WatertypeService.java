package watertype;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Service voor watertype-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
 */
public class WatertypeService {
	private static final WatertypeService instance = new WatertypeService();
	private final WatertypeRepository repo;
	
	private WatertypeService() {
		repo = new WatertypeRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static WatertypeService getInstance() {
return instance;
}
	
	public Iterable<Watertype> getAll() throws ApiException {
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve watertypes");
		}
	}
	
	public Watertype save(Watertype watertype) throws ApiException{
		try {
			repo.persist(watertype);
			return watertype;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save watertypes");
		}
	}
}

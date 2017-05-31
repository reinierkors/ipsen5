package waterschap;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Service voor waterschap-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Wander Groeneveld
 * @version 0.1, 30-5-2017
 */
public class WaterschapService {
	private static final WaterschapService instance = new WaterschapService();
	private final WaterschapRepository repo;
	
	private WaterschapService() {
		repo = new WaterschapRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static WaterschapService getInstance() {
		return instance;
	}
	
	public Iterable<Waterschap> getAll() throws ApiException {
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve waterschappen");
		}
	}
	
}

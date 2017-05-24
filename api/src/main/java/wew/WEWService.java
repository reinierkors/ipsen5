package wew;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;
import wew.factor.WEWFactorRepository;
import wew.factorClass.WEWFactorClassRepository;
import wew.value.WEWValueRepository;

/**
 * Service voor wew-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWService {
	private static final WEWService instance = new WEWService();
	private final WEWFactorRepository factorRepo;
	private final WEWFactorClassRepository factorClassRepo;
	private final WEWValueRepository valueRepo;
	
	private WEWService() {
		factorRepo = new WEWFactorRepository(ConnectionManager.getInstance().getConnection());
		factorClassRepo = new WEWFactorClassRepository(ConnectionManager.getInstance().getConnection());
		valueRepo = new WEWValueRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static WEWService getInstance() {
		return instance;
	}
	
	
}

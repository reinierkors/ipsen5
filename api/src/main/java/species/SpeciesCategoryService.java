package species;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Service voor species-category-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesCategoryService {
	private static final SpeciesCategoryService instance = new SpeciesCategoryService();
	private SpeciesCategoryRepository repo;
	
	private SpeciesCategoryService() {
		repo = new SpeciesCategoryRepository(ConnectionManager.getInstance().getConnection());
		
	}
	
	public static SpeciesCategoryService getInstance() {
		return instance;
	}
	
	public SpeciesCategory get(int id) throws ApiException {
		try {
			SpeciesCategory speciesCategory = repo.get(id);
			if(speciesCategory==null) {
				throw new ApiException("SpeciesCategory does not exist");
			}
			return speciesCategory;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve speciesCategory");
		}
	}
	
	public Iterable<SpeciesCategory> getAll() throws ApiException{
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Error retrieving all species categories");
		}
	}
}

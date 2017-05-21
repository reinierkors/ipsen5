package species;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Service voor species-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesService {
	private static final SpeciesService instance = new SpeciesService();
	private SpeciesRepository repo;
	
	private SpeciesService() {
		repo = new SpeciesRepository(ConnectionManager.getInstance().getConnection());
		
	}
	
	public static SpeciesService getInstance() {
		return instance;
	}
	
	public Species get(int id) throws ApiException {
		try {
			Species species = repo.get(id);
			if(species==null) {
				throw new ApiException("Species does not exist");
			}
			return species;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve species");
		}
	}
	
	public Species findOrCreate(String name){
		Species species = repo.findByName(name);
		if(species==null){
			species = new Species(name);
			repo.persist(species);
		}
		return null;
	}
}

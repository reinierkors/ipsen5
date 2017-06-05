package species;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.List;

/**
 * Service voor species-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Wander Groeneveld
 * @version 0.2, 30-5-2017
 */
public class SpeciesService {
	private static final SpeciesService instance = new SpeciesService();
	private final SpeciesRepository repo;
	
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
	
	public List<Species> get(List<Integer> ids) throws ApiException {
		try {
			return repo.get(ids);
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve species");
		}
	}
	
	public Species findOrCreate(String name) throws ApiException{
		try {
			Species species = repo.findByName(name);
			if (species == null) {
				species = new Species(name);
				repo.persist(species);
			}
			return species;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve species");
		}
	}
	
	//TODO: optimise, find multiple in a single database query
	public Species find(String name) throws ApiException{
		try {
			return repo.findByName(name);
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve species");
		}
	}
	
	public Species save(Species species) throws ApiException{
		try {
			repo.persist(species);
			return species;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save species");
		}
	}
	
}

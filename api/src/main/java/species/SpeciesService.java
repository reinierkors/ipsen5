package species;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.List;

/**
 * Service for species
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
	
	/**
	 * Retrieves a species with a given id
	 * @param id the id of the species to return
	 * @return a Species object
	 * @throws ApiException when there was a problem retrieving the species or the species was not found
	 */
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
	
	/**
	 * Retrieves species with the given ids
	 * @param ids the ids of the species to return
	 * @return a list containing the species that were found
	 * @throws ApiException when there was a problem retrieving the species
	 */
	public List<Species> get(List<Integer> ids) throws ApiException {
		try {
			return repo.get(ids);
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve species");
		}
	}
	
	/**
	 * Finds a species by name or creates it if it doesn't exist
	 * @param name the name of the species
	 * @return a species object
	 * @throws ApiException when there was a problem finding or creating the species
	 */
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
	
	/**
	 * Finds a species by name
	 * @param name the species name
	 * @return a species object with a given name or null if none was found
	 * @throws ApiException when there's a problem retrieving the species
	 */
	public Species find(String name) throws ApiException{
		try {
			return repo.findByName(name);
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve species");
		}
	}
	
	/**
	 * Stores a species object
	 * @param species the species object to store
	 * @return the species object after it's been saved
	 * @throws ApiException when there was a problem storing the species
	 */
	public Species save(Species species) throws ApiException{
		try {
			repo.persist(species);
			return species;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save species");
		}
	}

    public List<Species> getAll() {
		return repo.getAll();
    }
}

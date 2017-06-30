package taxon;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;
import taxon.group.TaxonGroup;
import taxon.group.TaxonGroupRepository;
import taxon.level.TaxonLevel;
import taxon.level.TaxonLevelRepository;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for taxon
 *
 * @author Wander Groeneveld
 * @version 0.3, 13-6-2017
 */
public class TaxonService{
	private static TaxonService instance;
	private final TaxonRepository taxonRepo;
	private final TaxonGroupRepository groupRepo;
	private final TaxonLevelRepository levelRepo;
	
	private TaxonService(){
		Connection con = ConnectionManager.getInstance().getConnection();
		taxonRepo = new TaxonRepository(con);
		groupRepo = new TaxonGroupRepository(con);
		levelRepo = new TaxonLevelRepository(con);
	}
	
	public static TaxonService getInstance(){
		if(instance == null)
			instance = new TaxonService();
		return instance;
	}
	
	/**
	 * Retrieves a taxon with a given id
	 *
	 * @param id the id of the taxon to return
	 * @return a Taxon object
	 * @throws ApiException when there was a problem retrieving the taxon or the taxon was not found
	 */
	public Taxon get(int id) throws ApiException{
		try{
			return taxonRepo.get(id);
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxon");
		}
	}
	
	/**
	 * Retrieves taxa with the given ids
	 *
	 * @param ids the ids of the taxa to return
	 * @return a list containing the taxa that were found
	 * @throws ApiException when there was a problem retrieving the taxa
	 */
	public List<Taxon> get(List<Integer> ids) throws ApiException{
		try{
			return taxonRepo.get(ids);
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxa");
		}
	}
	
	public List<Taxon> getAll() throws ApiException{
		try{
			return taxonRepo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxa");
		}
	}
	
	/**
	 * Finds a taxon by name or creates it if it doesn't exist
	 *
	 * @param name the name of the taxon
	 * @return a taxon object
	 * @throws ApiException when there was a problem finding or creating the taxon
	 */
	public Taxon findOrCreate(String name) throws ApiException{
		try{
			name = name.toLowerCase();
			Taxon taxon = taxonRepo.findByName(name);
			if(taxon == null){
				taxon = new Taxon();
				taxon.setName(name);
				taxonRepo.persist(taxon);
			}
			return taxon;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxon");
		}
	}
	
	/**
	 * Finds a taxon by name
	 *
	 * @param name the taxon name
	 * @return a taxon object with a given name or null if none was found
	 * @throws ApiException when there's a problem retrieving the taxon
	 */
	public Taxon find(String name) throws ApiException{
		try{
			name = name.toLowerCase();
			return taxonRepo.findByName(name);
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxon");
		}
	}
	
	/**
	 * Stores a taxon object
	 *
	 * @param taxon the taxon object to store
	 * @return the taxon object after it's been saved
	 * @throws ApiException when there was a problem storing the taxon
	 */
	public Taxon save(Taxon taxon) throws ApiException{
		try{
			taxon.setName(taxon.getName().toLowerCase());
			taxonRepo.persist(taxon);
			return taxon;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save taxon");
		}
	}
	
	/**
	 * Stores taxon objects
	 *
	 * @param taxa list of taxon objects to store
	 * @return the taxon objects after they've been saved
	 * @throws ApiException when there was a problem storing the taxa
	 */
	public List<Taxon> save(List<Taxon> taxa) throws ApiException{
		try{
			taxa.forEach(taxon -> taxon.setName(taxon.getName().toLowerCase()));
			taxonRepo.persist(taxa);
			return taxa;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save taxa");
		}
	}
	
	/**
	 * Looks first for taxa with the same names, overwrites them if it finds any
	 *
	 * @param taxa list of taxon objects to store
	 * @return the taxon objects after they've been saved
	 * @throws ApiException when there was a problem storing the taxa
	 */
	public List<Taxon> saveMerge(List<Taxon> taxa) throws ApiException{
		try{
			taxa.forEach(taxon -> taxon.setName(taxon.getName().toLowerCase()));
			
			List<Taxon> existing = taxonRepo.findByNames(taxa.stream().map(taxon -> taxon.getName()).collect(Collectors.toList()));
			Map<String, Taxon> existingMap = new HashMap<>();
			existing.forEach(t -> existingMap.put(t.getName(), t));
			
			taxa.forEach(taxon -> {
				if(existingMap.containsKey(taxon.getName())){
					taxon.setId(existingMap.get(taxon.getName()).getId());
				}
			});
			
			taxonRepo.persist(taxa);
			
			return taxa;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save taxa");
		}
	}
	
	public List<TaxonGroup> getGroups(){
		try{
			return groupRepo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxon groups");
		}
	}
	
	public List<TaxonLevel> getLevels(){
		try{
			return levelRepo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxon levels");
		}
	}
	
	public List<TaxonGroup> saveGroups(List<TaxonGroup> groups){
		try{
			groupRepo.persist(groups);
			return groups;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save taxon groups");
		}
	}
	
	public List<TaxonLevel> saveLevels(List<TaxonLevel> levels){
		try{
			levelRepo.persist(levels);
			return levels;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save taxon levels");
		}
	}
	
	/**
	 * Retrieve a list containing a taxon (by id) and all its ancestors and descendants
	 *
	 * @param id
	 * @return
	 */
	public List<Taxon> getFamily(int id){
		try{
			List<Taxon> taxa = new ArrayList<>();
			Taxon start = taxonRepo.get(id);
			taxa.add(start);
			
			//Find ancestors
			Taxon taxon = start;
			while(taxon != null && taxon.getParentId() != null){
				taxon = taxonRepo.get(taxon.getParentId());
				taxa.add(taxon);
			}
			
			//Find children
			List<Integer> lookForChildren = new ArrayList<>();
			lookForChildren.add(id);
			while(lookForChildren.size() > 0){
				List<Taxon> children = taxonRepo.findChildren(lookForChildren);
				taxa.addAll(children);
				lookForChildren.clear();
				for(Taxon child : children){
					lookForChildren.add(child.getId());
				}
			}
			
			return taxa;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve taxon family");
		}
	}
}

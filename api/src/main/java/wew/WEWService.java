package wew;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;
import wew.factor.WEWFactor;
import wew.factor.WEWFactorRepository;
import wew.factorClass.WEWFactorClass;
import wew.factorClass.WEWFactorClassRepository;
import wew.value.WEWValue;
import wew.value.WEWValueRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for all WEW action (values, factors and factor classes)
 *
 * @author Wander Groeneveld
 * @version 0.2, 6-6-2017
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
	
	/**
	 * Retrieve a list of wew values for a list of taxon
	 * @param taxonIds list of taxon ids
	 * @return list of wew values
	 * @throws ApiException when there was a problem retrieving the wew values
	 */
	public List<WEWValue> getByTaxon(List<Integer> taxonIds) throws ApiException{
		 try{
		 	return valueRepo.getByTaxon(taxonIds);
		 }
		 catch(RepositoryException e){
		 	throw new ApiException("Could not retrieve WEW values");
		 }
	}
	
	/**
	 * Retrieves all WEW values
	 * @return list of all wew values
	 * @throws ApiException when there was a problem retrieving the WEW values
	 */
	public List<WEWValue> getAllValues() throws ApiException{
		try{
			return valueRepo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve WEW values");
		}
	}
	
	/**
	 * Retrieve all factors and factor classes
	 * @return a list of factors with their classes in each of them
	 * @throws ApiException when there was a problem retrieving the factors or factor classes
	 */
	public List<WEWFactorWeb> getFactors() throws ApiException{
		try{
			List<WEWFactor> factors = factorRepo.getAll();
			List<WEWFactorClass> classes = factorClassRepo.getAll();
			List<WEWFactorWeb> webFactors = new ArrayList<>();
			
			factors.forEach( factor -> {
				WEWFactorWeb webFactor = new WEWFactorWeb(factor);
				List<WEWFactorClass> factorClasses = classes.stream().filter(cl->cl.getFactorId()==factor.getId()).collect(Collectors.toList());
				webFactor.setClasses(factorClasses);
				webFactors.add(webFactor);
			});
			return webFactors;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve WEW factor information");
		}
	}
	
	/**
	 * Save the WEW values
	 * @param values list of WEW values
	 * @return a list of the WEW values after they've been stored
	 * @throws ApiException when there was a problem saving the WEW values
	 */
	public List<WEWValue> saveValues(List<WEWValue> values) throws ApiException{
		try{
			valueRepo.persist(values);
			return values;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save WEW values");
		}
	}
	
	/**
	 * Save WEW factors and their factor classes
	 * @param factors list of factors with factor classes in them
	 * @return the same list after everything has been saved
	 * @throws ApiException when there was a problem saving the factors or factor classes
	 */
	public List<WEWFactorWeb> saveFactors(List<WEWFactorWeb> factors) throws ApiException{
		try{
			factorRepo.persist(factors);
			
			Set<WEWFactorClass> classes = new HashSet<>();
			for(WEWFactorWeb factor : factors){
				factor.getClasses().forEach(cl -> cl.setFactorId(factor.getId()));
				classes.addAll(factor.getClasses());
			}
			
			factorClassRepo.persist(new ArrayList<>(classes));
			
			return factors;
		}
		catch(RepositoryException e){
			e.printStackTrace();
			throw new ApiException("Could not save WEW factor information");
		}
	}
	
	/**
	 * Check if all WEW tables are empty
	 * @return true if `wew_value`, `wew_factor` and `wew_factor_class` are all empty
	 * @throws ApiException when there was a problem checking the state of the tables
	 */
	public boolean areTablesEmpty() throws ApiException{
		try{
			return valueRepo.isEmpty() && factorRepo.isEmpty() && factorClassRepo.isEmpty();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not determine whether WEW tables are empty");
		}
	}
	
	/**
	 * Remove all data from all WEW tables
	 * @throws ApiException when there was a problem emptying one or more tables
	 */
	public void emptyAllTables() throws ApiException{
		try{
			valueRepo.emptyTable();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not delete all WEW values");
		}
		try{
			factorClassRepo.emptyTable();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not delete all WEW factor classes");
		}
		try{
			factorRepo.emptyTable();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not delete all WEW factors");
		}
	}
	
	/**
	 * It's like a WEWFactor but with WEWFactorClass objects store within it
	 * Makes it easier on the frontend to work with factors
	 */
	public class WEWFactorWeb extends WEWFactor{
		List<WEWFactorClass> classes;
		
		public WEWFactorWeb(WEWFactor factor){
			super(factor.getId(),factor.getName());
		}
		
		public List<WEWFactorClass> getClasses() {
			return classes;
		}
		
		public void setClasses(List<WEWFactorClass> classes) {
			this.classes = classes;
		}
	}
}

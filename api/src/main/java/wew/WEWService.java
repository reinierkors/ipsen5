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
 * Service voor wew-gerelateerde business logic
 * Staat tussen de router en de repository
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
	
	public List<WEWValue> getBySpecies(List<Integer> speciesIds) throws ApiException{
		 try{
		 	return valueRepo.getBySpecies(speciesIds);
		 }
		 catch(RepositoryException e){
		 	throw new ApiException("Could not retrieve WEW values");
		 }
	}
	
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
	
	public List<WEWValue> saveValues(List<WEWValue> values) throws ApiException{
		try{
			valueRepo.persist(values);
			return values;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save WEW values");
		}
	}
	
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
			throw new ApiException("Could not save WEW factor information");
		}
	}
	
	//It's like the non-web version, but with extra toppings
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

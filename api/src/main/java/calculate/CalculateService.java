package calculate;

import api.ApiException;
import location.Location;
import location.LocationService;
import reference.Reference;
import reference.ReferenceService;
import sample.Sample;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service with methods regarding calculating sample values (using the WEW list)
 *
 * @author Wander Groeneveld
 * @version 0.3, 12-6-2017
 */
public class CalculateService{
	private static CalculateService instance;
	private final CalculateRepostory repo;
	
	public CalculateService(){
		this.repo = new CalculateRepostory();
	}
	
	public static CalculateService getInstance(){
		if(instance == null)
			instance = new CalculateService();
		return instance;
	}
	
	public void calculateSampleValues(int sampleId) throws ApiException{
		try{
			repo.calculateSampleValues(sampleId);
		}
		catch(SQLException e){
			throw new ApiException("Problem running the sample calculation query");
		}
	}
	
	public void calculateReferenceValues(int referenceId) throws ApiException{
		try{
			repo.calculateReferenceValues(referenceId);
		}
		catch(SQLException e){
			throw new ApiException("Problem running the reference calculation query");
		}
	}
	
	public List<CalculateRepostory.CalculationData> getBySample(int sampleId) throws ApiException{
		try{
			return repo.getBySample(sampleId);
		}
		catch(SQLException e){
			throw new ApiException("Could not retrieve sample calculations");
		}
	}
	
	public List<CalculateRepostory.CalculationData> getByReference(int referenceId) throws ApiException{
		try{
			return repo.getByReference(referenceId);
		}
		catch(SQLException e){
			throw new ApiException("Could not retrieve reference calculations");
		}
	}
	
	public void deleteBySample(int sampleId) throws ApiException{
		try{
			repo.deleteBySample(sampleId);
		}
		catch(SQLException e){
			throw new ApiException("Could not delete sample calculations");
		}
	}
	
	public void deleteByReference(int referenceId) throws ApiException{
		try{
			repo.deleteByReference(referenceId);
		}
		catch(SQLException e){
			throw new ApiException("Could not delete reference calculations");
		}
	}
	
	public double calculateSampleQuality(int sampleId,int referenceId) throws ApiException{
		List<CalculateRepostory.CalculationData> sampleCalcs = getBySample(sampleId);
		List<CalculateRepostory.CalculationData> refCalcs = getByReference(referenceId);
		
		if(sampleCalcs.size() == 0 || refCalcs.size() == 0)
			throw new ApiException("Missing calculations");
		
		Map<Integer, CalculateRepostory.CalculationData> factorClassRefCalcMap = new HashMap<>();
		refCalcs.forEach(refCalcData -> factorClassRefCalcMap.put(refCalcData.factorClassId, refCalcData));
		
		double total = 0;
		for(CalculateRepostory.CalculationData sampleCalcData : sampleCalcs){
			CalculateRepostory.CalculationData refCalcData = factorClassRefCalcMap.get(sampleCalcData.factorClassId);
			if(refCalcData != null){
				total += Math.abs(refCalcData.computedValue - sampleCalcData.computedValue);
			}
		}
		
		return total;
	}
}

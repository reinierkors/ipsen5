package calculate;

import api.ApiException;
import database.ConnectionManager;
import location.Location;
import location.LocationService;
import reference.Reference;
import reference.ReferenceService;
import sample.Sample;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service with methods regarding calculating sample values (using the WEW list)
 *
 * @author Wander Groeneveld
 * @version 0.3, 12-6-2017
 */
public class CalculateService {
	private Connection connection;
	private static final CalculateService instance = new CalculateService();
	
	private String queryCalcSample = "INSERT INTO `sample_wew_factor_class`(`sample_id`,`factor_class_id`,`computed_value`) "+
		"SELECT `sample_id`,`factor_class_id`,AVG(`wew_value`.`value`) "+
		"FROM `sample_taxon` "+
		"INNER JOIN `wew_value` "+
		"ON `wew_value`.`taxon_id` = `sample_taxon`.`taxon_id` "+
		"WHERE `sample_id` = ? "+
		"GROUP BY `factor_class_id`, `sample_id` ";
	
	private String queryCalcReference = "INSERT INTO `reference_wew_factor_class`(`reference_id`,`factor_class_id`,`computed_value`) "+
			"SELECT `reference_id`,`factor_class_id`,AVG(`wew_value`.`value`) "+
			"FROM `reference_taxon` "+
			"INNER JOIN `wew_value` "+
			"ON `wew_value`.`taxon_id` = `reference_taxon`.`taxon_id` "+
			"WHERE `reference_id` = ? "+
			"GROUP BY `factor_class_id`, `reference_id` ";
	
	private String queryGetBySample = "SELECT `factor_class_id`,`computed_value` FROM `sample_wew_factor_class` WHERE `sample_id` = ?";
	private String queryGetByReference = "SELECT `factor_class_id`,`computed_value` FROM `reference_wew_factor_class` WHERE `reference_id` = ?";
	
	private String queryDeleteBySample = "DELETE FROM `sample_wew_factor_class` WHERE `sample_id` = ?";
	private String queryDeleteByReference = "DELETE FROM `reference_wew_factor_class` WHERE `reference_id` = ?";
	
	public CalculateService(){
		this.connection = ConnectionManager.getInstance().getConnection();
	}
	
	public static CalculateService getInstance() {
		return instance;
	}
	
	/**
	 * Runs a query on the server that calculates and stores water quality properties
	 * @param sampleId the id of the sample object to calculate the properties of
	 */
	public void calculateSampleValues(int sampleId){
		try {
			PreparedStatement psCalcSample = this.connection.prepareStatement(queryCalcSample);
			psCalcSample.setInt(1,sampleId);
			psCalcSample.executeUpdate();
		}
		catch(SQLException e){
			throw new ApiException("Problem running the sample calculation query");
		}
	}
	
	/**
	 * Runs a query on the server that calculates and stores reference water quality properties
	 * @param referenceId the id of the reference to calculate the properties of
	 */
	public void calculateReferenceValues(int referenceId){
		try {
			PreparedStatement psCalcReference = this.connection.prepareStatement(queryCalcReference);
			psCalcReference.setInt(1,referenceId);
			psCalcReference.executeUpdate();
		}
		catch(SQLException e){
			throw new ApiException("Problem running the reference calculation query");
		}
	}
	
	/**
	 * Retrieves calculated water quality properties of a single sample
	 * @param sampleId the id of a sample
	 * @return a list containing water quality properties
	 */
	public List<CalculationData> getBySample(int sampleId){
		try {
			PreparedStatement psGetBySample = this.connection.prepareStatement(queryGetBySample);
			psGetBySample.setInt(1,sampleId);
			ResultSet resultSet = psGetBySample.executeQuery();
			
			List<CalculationData> list = new ArrayList<>();
			if(resultSet==null)
				return list;
			
			while(resultSet.next()){
				list.add(new CalculationData(resultSet.getInt("factor_class_id"),resultSet.getDouble("computed_value")));
			}
			
			return list;
		}
		catch(SQLException e){
			throw new ApiException("Could not retrieve sample calculations");
		}
	}
	
	/**
	 * Retrieves calculated water quality properties of a reference
	 * @param referenceId the id of a reference
	 * @return a list containing reference water quality properties
	 */
	public List<CalculationData> getByReference(int referenceId){
		try {
			PreparedStatement psGetByReference = this.connection.prepareStatement(queryGetByReference);
			psGetByReference.setInt(1,referenceId);
			ResultSet resultSet = psGetByReference.executeQuery();
			
			List<CalculationData> list = new ArrayList<>();
			if(resultSet==null)
				return list;
			
			while(resultSet.next()){
				list.add(new CalculationData(resultSet.getInt("factor_class_id"),resultSet.getDouble("computed_value")));
			}
			
			return list;
		}
		catch(SQLException e){
			throw new ApiException("Could not retrieve reference calculations");
		}
	}
	
	public boolean deleteBySample(int id){
		try {
			PreparedStatement psDeleteBySample = this.connection.prepareStatement(queryDeleteBySample);
			psDeleteBySample.setInt(1,id);
			ResultSet resultSet = psDeleteBySample.executeQuery();
			
			if(resultSet==null)
				return false;
			
			return true;
		}
		catch(SQLException e){
			throw new ApiException("Could not delete sample calculations");
		}
	}
	
	public boolean deleteByReference(int id){
		try {
			PreparedStatement psDeleteByReference = this.connection.prepareStatement(queryDeleteByReference);
			psDeleteByReference.setInt(1,id);
			ResultSet resultSet = psDeleteByReference.executeQuery();
			
			if(resultSet==null)
				return false;
			
			return true;
		}
		catch(SQLException e){
			throw new ApiException("Could not delete reference calculations");
		}
	}
	
	public void calculateSampleQuality(Sample sample){
		List<CalculationData> sampleCalcs = this.getBySample(sample.getId());
		
		Location location = LocationService.getInstance().getById(sample.getLocationId());
		int watertype = location.getWatertypeKrwId();
		Reference reference = ReferenceService.getInstance().getByWatertype(watertype);
		
		List<CalculationData> refCalcs = this.getByReference(reference.getId());
		
		Map<Integer,CalculationData> factorClassRefCalcMap = new HashMap<>();
		refCalcs.forEach(refCalcData -> factorClassRefCalcMap.put(refCalcData.factorClassId,refCalcData));
		
		double total = 0;
		for(CalculationData sampleCalcData : sampleCalcs){
			CalculationData refCalcData = factorClassRefCalcMap.get(sampleCalcData.factorClassId);
			if(refCalcData==null)
				return;
			total += Math.abs(refCalcData.computedValue - sampleCalcData.computedValue);
		}
		
		sample.setQuality(total);
	}
	
	/**
	 * A pair of factor class and calculated value for samples and references
	 * The value is the average of all taxon in the WEW list for a given factor class
	 */
	public class CalculationData{
		public int factorClassId;
		public double computedValue;
		
		public CalculationData(int factorClassId, double computedValue) {
			this.factorClassId = factorClassId;
			this.computedValue = computedValue;
		}
	}
}

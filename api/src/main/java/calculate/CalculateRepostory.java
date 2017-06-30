package calculate;

import database.ConnectionManager;

import javax.xml.transform.Result;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CalculateRepostory{
	private final Connection connection;
	private final String queryCalcSample = "INSERT INTO `sample_wew_factor_class`(`sample_id`,`factor_class_id`,`computed_value`) " +
			"SELECT `sample_id`,`factor_class_id`,AVG(`wew_value`.`value`) " +
			"FROM `sample_taxon` " +
			"INNER JOIN `wew_value` " +
			"ON `wew_value`.`taxon_id` = `sample_taxon`.`taxon_id` " +
			"WHERE `sample_id` = ? " + "GROUP BY `factor_class_id`, `sample_id` ";
	
	private final String queryCalcReference = "INSERT INTO `reference_wew_factor_class`(`reference_id`,`factor_class_id`,`computed_value`) " +
			"SELECT `reference_id`,`factor_class_id`,AVG(`wew_value`.`value`) " +
			"FROM `reference_taxon` " +
			"INNER JOIN `wew_value` " + "ON `wew_value`.`taxon_id` = `reference_taxon`.`taxon_id` " +
			"WHERE `reference_id` = ? " +
			"GROUP BY `factor_class_id`, `reference_id` ";
	
	private final String queryGetBySample = "SELECT `factor_class_id`,`computed_value` FROM `sample_wew_factor_class` WHERE `sample_id` = ?";
	private final String queryGetByReference = "SELECT `factor_class_id`,`computed_value` FROM `reference_wew_factor_class` WHERE `reference_id` = ?";
	
	private final String queryDeleteBySample = "DELETE FROM `sample_wew_factor_class` WHERE `sample_id` = ?";
	private final String queryDeleteByReference = "DELETE FROM `reference_wew_factor_class` WHERE `reference_id` = ?";
	
	private final String queryHasSampleCalcs = "SELECT NULL FROM `sample_wew_factor_class` WHERE `sample_id` = ? LIMIT 1";
	private final String queryHasRefCalcs = "SELECT NULL FROM `reference_wew_factor_class` WHERE `reference_id` = ? LIMIT 1";
	
	public CalculateRepostory(){
		connection = ConnectionManager.getInstance().getConnection();
	}
	
	/**
	 * Runs a query on the server that calculates and stores water quality properties
	 *
	 * @param sampleId the id of the sample object to calculate the properties of
	 */
	public void calculateSampleValues(int sampleId) throws SQLException{
		PreparedStatement psCalcSample = connection.prepareStatement(queryCalcSample);
		psCalcSample.setInt(1, sampleId);
		psCalcSample.executeUpdate();
	}
	
	/**
	 * Runs a query on the server that calculates and stores reference water quality properties
	 *
	 * @param referenceId the id of the reference to calculate the properties of
	 */
	public void calculateReferenceValues(int referenceId) throws SQLException{
		PreparedStatement psCalcReference = connection.prepareStatement(queryCalcReference);
		psCalcReference.setInt(1, referenceId);
		psCalcReference.executeUpdate();
	}
	
	/**
	 * Retrieves calculated water quality properties of a single sample
	 *
	 * @param sampleId the id of a sample
	 * @return a list containing water quality properties
	 */
	public List<CalculationData> getBySample(int sampleId) throws SQLException{
		PreparedStatement psGetBySample = connection.prepareStatement(queryGetBySample);
		psGetBySample.setInt(1, sampleId);
		ResultSet resultSet = psGetBySample.executeQuery();
		
		List<CalculationData> list = new ArrayList<>();
		if(resultSet == null)
			return list;
		
		while(resultSet.next()){
			list.add(new CalculationData(resultSet.getInt("factor_class_id"), resultSet.getDouble("computed_value")));
		}
		
		return list;
	}
	
	/**
	 * Retrieves calculated water quality properties of a reference
	 *
	 * @param referenceId the id of a reference
	 * @return a list containing reference water quality properties
	 */
	public List<CalculationData> getByReference(int referenceId) throws SQLException{
		PreparedStatement psGetByReference = connection.prepareStatement(queryGetByReference);
		psGetByReference.setInt(1, referenceId);
		ResultSet resultSet = psGetByReference.executeQuery();
		
		List<CalculationData> list = new ArrayList<>();
		if(resultSet == null)
			return list;
		
		while(resultSet.next()){
			list.add(new CalculationData(resultSet.getInt("factor_class_id"), resultSet.getDouble("computed_value")));
		}
		
		return list;
	}
	
	/**
	 * Deletes all calculations of a sample
	 * @param id the sample id
	 * @throws SQLException
	 */
	public void deleteBySample(int id) throws SQLException{
		PreparedStatement psDeleteBySample = connection.prepareStatement(queryDeleteBySample);
		psDeleteBySample.setInt(1, id);
		psDeleteBySample.executeUpdate();
	}
	
	/**
	 * Deletes all calculations of a reference
	 * @param id the reference id
	 * @throws SQLException
	 */
	public void deleteByReference(int id) throws SQLException{
		PreparedStatement psDeleteByReference = connection.prepareStatement(queryDeleteByReference);
		psDeleteByReference.setInt(1, id);
		psDeleteByReference.executeUpdate();
	}
	
	/**
	 * Check whether a sample has any calcs
	 * @param id sample id
	 * @return true if any calculations are found
	 * @throws SQLException
	 */
	public boolean hasSampleCalcs(int id) throws SQLException{
		PreparedStatement psHasSampleCalcs = connection.prepareStatement(queryHasSampleCalcs);
		psHasSampleCalcs.setInt(1,id);
		ResultSet resultSet = psHasSampleCalcs.executeQuery();
		return resultSet == null || !resultSet.next();
	}
	
	/**
	 * Check wehther a reference has any calcs
	 * @param id reference is
	 * @return true if any calculations are found
	 * @throws SQLException
	 */
	public boolean hasReferenceCalcs(int id) throws SQLException{
		PreparedStatement psHasRefCalcs = connection.prepareStatement(queryHasRefCalcs);
		psHasRefCalcs.setInt(1,id);
		ResultSet resultSet = psHasRefCalcs.executeQuery();
		return resultSet == null || !resultSet.next();
	}
	
	/**
	 * A pair of factor class and calculated value for samples and references
	 * The value is the average of all taxon in the WEW list for a given factor class
	 */
	public class CalculationData{
		public final int factorClassId;
		public final double computedValue;
		
		public CalculationData(int factorClassId, double computedValue){
			this.factorClassId = factorClassId;
			this.computedValue = computedValue;
		}
	}
	
}

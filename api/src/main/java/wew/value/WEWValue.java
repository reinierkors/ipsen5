package wew.value;

/**
 * A single value in the WEW-list
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWValue {
	private int id;
	private int factorClassId;
	private int taxonId;
	private Double value;
	
	public WEWValue(int id, int factorClassId, int taxonId, Double value) {
		this.id = id;
		this.factorClassId = factorClassId;
		this.taxonId = taxonId;
		this.value = value;
	}
	
	public WEWValue(int factorClassId, int taxonId, Double value) {
		this(0,factorClassId,taxonId,value);
	}
	
	public WEWValue() {
		this(0,0,0,null);
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getFactorClassId() {
		return factorClassId;
	}
	
	public void setFactorClassId(int factorClassId) {
		this.factorClassId = factorClassId;
	}
	
	public int getTaxonId() {
		return taxonId;
	}
	
	public void setTaxonId(int taxonId) {
		this.taxonId = taxonId;
	}
	
	public Double getValue() {
		return value;
	}
	
	public void setValue(Double value) {
		this.value = value;
	}
}

package reference;

import java.util.ArrayList;
import java.util.List;

/**
 * Reference model
 *
 * @author Wander Groeneveld
 * @version 0.1, 19-6-2017
 */
public class Reference{
	private int id;
	private int watertypeId;
	private List<Integer> taxonIds;
	
	public Reference(int id, int watertypeId, List<Integer> taxonIds){
		this.id = id;
		this.watertypeId = watertypeId;
		this.taxonIds = taxonIds;
	}
	
	public Reference(int watertypeId, List<Integer> taxonIds){
		this(0, watertypeId, taxonIds);
	}
	
	public Reference(){
		this(0, 0, new ArrayList<>());
	}
	
	public int getId(){
		return id;
	}
	
	public void setId(int id){
		this.id = id;
	}
	
	public int getWatertypeId(){
		return watertypeId;
	}
	
	public void setWatertypeId(int watertypeId){
		this.watertypeId = watertypeId;
	}
	
	public List<Integer> getTaxonIds(){
		return taxonIds;
	}
	
	public void setTaxonIds(List<Integer> taxonIds){
		this.taxonIds = taxonIds;
	}
}

package database;

import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * Used to specify column information in maria repositories
 * @author Wander Groeneveld
 * @version 0.1, 30-5-2017
 */
public class ColumnData<ENTITY_T,JAVA_T>{
	private final String columnName;
	private final int sqlType;
	private final Function<ENTITY_T,JAVA_T> getter;
	private final BiConsumer<ENTITY_T,JAVA_T> setter;
	private final boolean primary;
	
	public ColumnData(String columnName, int sqlType,Function<ENTITY_T,JAVA_T> getter, BiConsumer<ENTITY_T,JAVA_T> setter, boolean primary) {
		this.columnName = columnName;
		this.sqlType = sqlType;
		this.getter = getter;
		this.setter = setter;
		this.primary = primary;
	}
	
	public ColumnData(String columnName, int sqlType,Function<ENTITY_T,JAVA_T> getter, BiConsumer<ENTITY_T,JAVA_T> setter) {
		this(columnName, sqlType, getter, setter, false);
	}
	
	/**
	 * Applies the getter for this column on the given entity
	 * @param entity object to apply the getter on
	 * @return the value of this column on the object
	 */
	public JAVA_T callGetter(ENTITY_T entity){
		return getter.apply(entity);
	}
	
	/**
	 * Applies the setter for this column on the given entity
	 * @param entity the object to apply the setter on
	 * @param value the value to give to the setter of this column on the entity
	 */
	public void callSetter(ENTITY_T entity,JAVA_T value){
		setter.accept(entity,value);
	}
	
	/**
	 * The name of this column in the database
	 * @return
	 */
	public String getColumnName() {
		return columnName;
	}
	
	/**
	 * The SQL type of this column in the database
	 * @return one of the types in java.sql.Types
	 */
	public int getSqlType() {
		return sqlType;
	}
	
	/**
	 * Whether or not this column is a primary key in the database
	 * @return true if the column has a primary key index in the database
	 */
	public boolean isPrimary() {
		return primary;
	}
}

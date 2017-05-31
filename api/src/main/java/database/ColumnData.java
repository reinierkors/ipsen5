package database;

import java.util.function.BiConsumer;
import java.util.function.Function;

/**
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
	
	public JAVA_T callGetter(ENTITY_T entity){
		return getter.apply(entity);
	}
	
	public void callSetter(ENTITY_T entity,JAVA_T value){
		setter.accept(entity,value);
	}
	
	public String getColumnName() {
		return columnName;
	}
	
	public int getSqlType() {
		return sqlType;
	}
	
	public boolean isPrimary() {
		return primary;
	}
}

package persistence;

/**
 * Created by Dylan on 10-4-2017.
 */
public interface DatabaseAccess<T> {
    void insert(T model);
    T retrieveSpecific(T id);
    T retrieveAll();
    void edit(T id);
    void delete(T id);
}

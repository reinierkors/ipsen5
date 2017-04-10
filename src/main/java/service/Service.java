package service;

/**
 * Created by Dylan on 10-4-2017.
 */
public interface Service<T> {
    void insert(T model);
    T retrieveSpecific(T id);
    T retrieveAll();
    void edit(T id);
    void delete(T id);
}

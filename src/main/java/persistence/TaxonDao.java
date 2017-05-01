package persistence;

import model.Taxon;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Dylan on 12-4-2017.
 */
public class TaxonDao implements DatabaseAccess<Taxon> {

    private Connection connection;
    private PreparedStatement retrieveAllTaxons;
    private PreparedStatement retrieveTaxon;

    public TaxonDao() throws SQLException {
        connection = ConnectionManager.getInstance().getConnection();
        prepareAllStatements();
    }

    @Override
    public void prepareAllStatements() throws SQLException {
        retrieveAllTaxons = connection.prepareStatement("SELECT * FROM taxon LIMIT 10");
        retrieveTaxon = connection.prepareStatement("SELECT * FROM taxon WHERE taxon_name = ?");
    }

    @Override
    public void insert(Taxon model) {
        System.out.print("hoi");
    }

    @Override
    public Taxon retrieveSpecific(Taxon id) {
        return null;
    }

    public Taxon retrieveSpecificTaxon(String taxonName) throws SQLException {
        retrieveTaxon.setString(1, taxonName);
        ResultSet resultSet = retrieveTaxon.executeQuery();
        resultSet.next();
        if(resultSet.isAfterLast()) {
            return new Taxon();
        }
        return handleResult(resultSet);
    }
    @Override
    public ArrayList<Taxon> retrieveAll() throws SQLException {
        ArrayList<Taxon> taxons = new ArrayList<>();
        ResultSet resultSet = retrieveAllTaxons.executeQuery();
        while (resultSet.next()) {
            taxons.add(handleResult(resultSet));
        }
        return taxons;
    }

    @Override
    public void edit(Taxon id) {

    }

    @Override
    public void delete(Taxon id) {

    }

    @Override
    public Taxon handleResult(ResultSet resultSet) throws SQLException {
        Taxon taxon = new Taxon();
        taxon.setName(resultSet.getString("taxon_name"));
        taxon.setZoe(resultSet.getDouble("zoe"));
        taxon.setZzb(resultSet.getDouble("zzb"));
        taxon.setZb(resultSet.getDouble("zb"));
        taxon.setMb(resultSet.getDouble("mb"));
        taxon.setSbm(resultSet.getDouble("sbm"));
        taxon.setZoi(resultSet.getDouble("zoi"));
        taxon.setZor(resultSet.getDouble("zor"));
        taxon.setOi(resultSet.getDouble("oi"));
        taxon.setOr(resultSet.getDouble("or"));
        taxon.setDi(resultSet.getDouble("di"));
        taxon.setDr(resultSet.getDouble("dr"));
        taxon.setPe(resultSet.getDouble("pe"));
        taxon.setSp(resultSet.getDouble("sp"));
        taxon.settLesserThan3(resultSet.getDouble("t<3"));
        taxon.setT3Minus5(resultSet.getDouble("t3-5"));
        taxon.settBiggerThan5(resultSet.getDouble("t>5"));
        taxon.setZka(resultSet.getDouble("zka"));
        taxon.setZki(resultSet.getDouble("zki"));
        taxon.setZko(resultSet.getDouble("zko"));
        taxon.setKli(resultSet.getDouble("kli"));
        taxon.setKlo(resultSet.getDouble("klo"));
        taxon.setMi(resultSet.getDouble("mi"));
        taxon.setMo(resultSet.getDouble("mo"));
        taxon.setGi(resultSet.getDouble("gi"));
        taxon.setGo(resultSet.getDouble("go"));
        taxon.setOs(resultSet.getDouble("os"));
        taxon.setBms(resultSet.getDouble("bms"));
        taxon.setAms(resultSet.getDouble("ams"));
        taxon.setPs(resultSet.getDouble("ps"));
        taxon.setSti(resultSet.getDouble("sti"));
        taxon.setZls(resultSet.getDouble("zls"));
        taxon.setLs(resultSet.getDouble("ls"));
        taxon.setMs(resultSet.getDouble("ms"));
        taxon.setSs(resultSet.getDouble("ss"));
        taxon.setSl(resultSet.getDouble("sl"));
        taxon.setKl(resultSet.getDouble("kl"));
        taxon.setZa(resultSet.getDouble("za"));
        taxon.setGr(resultSet.getDouble("gr"));
        taxon.setSt(resultSet.getDouble("st"));
        taxon.setFd(resultSet.getDouble("fd"));
        taxon.setGd(resultSet.getDouble("gd"));
        taxon.setHo(resultSet.getDouble("ho"));
        taxon.setWp(resultSet.getDouble("wp"));
        taxon.setOv(resultSet.getDouble("ov"));
        taxon.setOt(resultSet.getDouble("ot"));
        taxon.setMot(resultSet.getDouble("mot"));
        taxon.setMt(resultSet.getDouble("mt"));
        taxon.setMet(resultSet.getDouble("met"));
        taxon.setEut(resultSet.getDouble("eut"));
        taxon.setZu(resultSet.getDouble("zu"));
        taxon.setZwz(resultSet.getDouble("zwz"));
        taxon.setNe(resultSet.getDouble("ne"));
        taxon.setBa(resultSet.getDouble("ba"));
        taxon.setRarity(resultSet.getString("rarity"));
        taxon.setNote(resultSet.getString("opmerking"));
        return taxon;
    }
}

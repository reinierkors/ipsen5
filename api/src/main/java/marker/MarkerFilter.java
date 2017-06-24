package marker;

/**
 * @author Dylan de Wit
 * @version 1.0, 19-6-2017
 */
public class MarkerFilter {
    private Integer waterschapId;
    private Integer watertypeId;
    private String date;

    public MarkerFilter() {

    }

    public MarkerFilter(Integer waterschapId, Integer watertypeId, String date) {
        this.waterschapId = waterschapId;
        this.watertypeId = watertypeId;
        this.date = date;
    }

    public Integer getWaterschapId() {
        return waterschapId;
    }

    public void setWaterschapId(Integer waterschapId) {
        this.waterschapId = waterschapId;
    }

    public Integer getWatertypeId() {
        return watertypeId;
    }

    public void setWatertypeId(Integer watertypeId) {
        this.watertypeId = watertypeId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}

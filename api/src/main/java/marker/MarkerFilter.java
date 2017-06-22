package marker;

/**
 * @author Dylan de Wit
 * @version 1.0, 19-6-2017
 */
public class MarkerFilter {
    private Integer waterschapId;
    private Integer watertypeId;

    public MarkerFilter() {

    }

    public MarkerFilter(Integer waterschapId, Integer watertypeId) {
        this.waterschapId = waterschapId;
        this.watertypeId = watertypeId;
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
}

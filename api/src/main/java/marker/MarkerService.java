package marker;

import location.Location;
import location.LocationService;
import waterschap.Waterschap;
import waterschap.WaterschapService;
import watertype.Watertype;
import watertype.WatertypeService;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Dylan de Wit
 * @version 1.0, 19-6-2017
 */
public class MarkerService {
    private static MarkerService instance;
    private LocationService locationService;
    private WatertypeService watertypeService;
    private WaterschapService waterschapService;

    private MarkerService() {
        locationService = LocationService.getInstance();
        watertypeService = WatertypeService.getInstance();
        waterschapService = WaterschapService.getInstance();
    }

    public static MarkerService getInstance() {
        if (instance == null) {
            instance = new MarkerService();
        }
        return instance;
    }

    public List<Marker> getFilteredMarkers(MarkerFilter filter) {
        List<Marker> markers = new ArrayList<>();
        Integer watertypeId = filter.getWatertypeId();
        Integer waterschapId = filter.getWaterschapId();
        Iterable<Location> locations =
                locationService.getByFilters(watertypeId, waterschapId);

        for (Location next : locations) {
            markers.add(filterMarker(watertypeId, waterschapId, next));
        }
        return markers;
    }

    private Marker filterMarker(Integer watertypeId, Integer waterschapId,
                                Location next) {
        Marker marker = new Marker();
        Watertype watertype = watertypeService.get(watertypeId);
        Waterschap waterschap = waterschapService.get(waterschapId);

        marker.setLocation(next);
        marker.setWaterschap(waterschap);
        if (next.getWaterschapId() != null && waterschap == null) {
            marker.setWaterschap(waterschapService.get(next.getWaterschapId()));
        }
        marker.setWatertype(watertypeService.get(next.getWatertypeId()));
        marker.setWatertypeKrw(watertypeService.get(next.getWatertypeKrwId()));
        return marker;
    }
}

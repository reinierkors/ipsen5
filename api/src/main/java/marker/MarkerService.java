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
        Iterable<Location> locations = locationService.getAll();
        Integer watertypeId = filter.getWatertypeId();
        Integer waterschapId = filter.getWaterschapId();

        for (Location next : locations) {
            if (((next.getWatertypeId() != watertypeId && next.getWatertypeKrwId()
                    != watertypeId) && watertypeId != 0) ||
                    (next.getWaterschapId() != waterschapId && waterschapId != 0)) {
                continue;
            }

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
        filterWatertype(watertypeId, next, marker, watertype);
        filterWaterschap(waterschapId, next, marker, waterschap);
        return marker;
    }

    private void filterWatertype(Integer watertypeId, Location next,
                                 Marker marker, Watertype watertype) {
        if (watertypeId == 0) {
            marker.setWatertype(watertypeService.get(next.getWatertypeId()));
            marker.setWatertypeKrw(watertypeService.get(next.getWatertypeKrwId()));
        } else if (next.getWatertypeId() == watertypeId) {
            marker.setWatertype(watertype);
            marker.setWatertypeKrw(watertypeService.get(next.getWatertypeKrwId()));
        } else if (next.getWatertypeKrwId() == watertypeId) {
            marker.setWatertype(watertypeService.get(next.getWatertypeId()));
            marker.setWatertypeKrw(watertype);
        }
    }

    private void filterWaterschap(Integer waterschapId, Location next,
                                  Marker marker, Waterschap waterschap) {
        if (waterschapId == 0) {
            if (next.getWaterschapId() != null) {
                marker.setWaterschap(waterschapService.get(next.getWaterschapId()));
            }
        } else if (next.getWaterschapId() == waterschapId) {
            marker.setWaterschap(waterschap);
        }
    }
}

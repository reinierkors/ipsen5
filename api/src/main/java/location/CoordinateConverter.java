package location;

/**
 * @author Dylan de Wit
 * @version 1.0, 24-5-2017
 */
public class CoordinateConverter {

    public CoordinateConverter() {

    }

    /**
     * Converts Rijksdriekhoek coordinates to usable Latitude and Longitude
     * coordinates
     *
     * @param x
     * @param y
     * @return Array consisting of [0] latitude, [1] longitude
     */
    public Double[] convertToLatLng(int x, int y) {
        // The city "Amersfoort" is used as reference "Rijksdriehoek" coordinate.
        int xReference = 155000;
        int yReference = 463000;
        double dX = (double) (x - xReference) * Math.pow(10, -5);
        double dY = (double) (y - yReference) * Math.pow(10, -5);
        double sumN =
                (3235.65389 * dY) +
                        (-32.58297 * Math.pow(dX, 2)) +
                        (-0.2475 * Math.pow(dY, 2)) +
                        (-0.84978 * Math.pow(dX, 2) * dY) +
                        (-0.0655 * Math.pow(dY, 3)) +
                        (-0.01709 * Math.pow(dX, 2) * Math.pow(dY, 2)) +
                        (-0.00738 * dX) +
                        (0.0053 * Math.pow(dX, 4)) +
                        (-0.00039 * Math.pow(dX, 2) * Math.pow(dY, 3)) +
                        (0.00033 * Math.pow(dX, 4) * dY) +
                        (-0.00012 * dX * dY);
        double sumE =
                (5260.52916 * dX) +
                        (105.94684 * dX * dY) +
                        (2.45656 * dX * Math.pow(dY, 2)) +
                        (-0.81885 * Math.pow(dX, 3)) +
                        (0.05594 * dX * Math.pow(dY, 3)) +
                        (-0.05607 * Math.pow(dX, 3) * dY) +
                        (0.01199 * dY) +
                        (-0.00256 * Math.pow(dX, 3) * Math.pow(dY, 2)) +
                        (0.00128 * dX * Math.pow(dY, 4)) +
                        (0.00022 * Math.pow(dY, 2)) +
                        (-0.00022 * Math.pow(dX, 2)) +
                        (0.00026 * Math.pow(dX, 5));
        // The city "Amersfoort" is used as reference "WGS84" coordinate.
        double referenceWgs84X = 52.15517;
        double referenceWgs84Y = 5.387206;
        double latitude = referenceWgs84X + (sumN / 3600);
        double longitude = referenceWgs84Y + (sumE / 3600);
        return new Double[]{latitude, longitude};
    }
}

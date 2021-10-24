const populationPointsConversion = (points) => ({
  "type": "FeatureCollection",
  "features": points.map(point => (
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [Number(point.lat), Number(point.lon)]
      },
      "properties": {
        "weight": Number(point.weight),
        "residents": Number(point.weight) * 31
      }
    }
  ))
});

export default populationPointsConversion;

const getDistance = (current, coords) => {
  if ((current[0] === coords[0]) && (current[1] === coords[1])) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * current[0]/180;
    var radlat2 = Math.PI * coords[0]/180;
    var theta = current[1] - coords[1];
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;
    return dist;
  }
}

export default getDistance

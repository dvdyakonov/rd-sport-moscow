const drawCircle = (coords, radius, color = "#ff0000") => {
    return new window.ymaps.Circle([coords, radius], {}, {
        fillColor: color,
        fillOpacity: 0.5,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWidth: 0
    });
}

export default drawCircle;

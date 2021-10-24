const drawCircle = (coords, radius, color = "#ff0000") => {
    return new window.ymaps.Circle([coords, radius], {
        balloonContent: "Радиус круга - 10 км",
        hintContent: "Радиус круга - 10 км"
    }, {
        fillColor: color,
        fillOpacity: 0.5,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWidth: 0
    });
}

export default drawCircle;

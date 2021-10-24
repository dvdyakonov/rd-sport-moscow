const drawCircle = (coords, radius, color = "#ff0000") => {
    return new window.ymaps.Circle([coords, radius], {
        balloonContent: "Радиус круга - 10 км",
        hintContent: "Подвинь меня"
    }, {
        fillColor: color,
        fillOpacity: 0.8,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWidth: 0
    });
} 

export default drawCircle;
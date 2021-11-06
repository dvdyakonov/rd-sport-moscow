const drawPolygon = (collection, button) => {
    const polygon = new window.ymaps.Polygon([], {}, {
        editorDrawingCursor: "crosshair",
        editorMaxPoints: 15,
        fillColor: 'rgba(14,14,14,0.2)',
        strokeColor: '#0000FF',
        strokeWidth: 5
    });

    collection.add(polygon)


    var stateMonitor = new window.ymaps.Monitor(polygon.editor.state);
    stateMonitor.add("drawing", function (newValue) {
        polygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
    });

    polygon.editor.startDrawing();
    polygon.editor.events.add("drawingstop", function (e) {
        // console.log(button.state);
        button.deselect();
        polygon.editor.stopDrawing();
        // getCoords(mapInstance, polygon, polygon.geometry.getCoordinates());
    });

    polygon.events.add('contextmenu', () => {
        console.log(12);
        // removePolygon(collection, polygon)
    });

    // return polygon;
};

const getCoords = (mapInstance, polygon, coordsArr) => {
    console.log(coordsArr);
    var stateMonitor = new window.ymaps.Monitor(polygon.editor.state);
    if (!stateMonitor.drawing) drawPolygon(mapInstance);
};

const removePolygon = (collection, polygon) => {
    collection.remove(polygon);
};

export { drawPolygon, removePolygon };
export default {}

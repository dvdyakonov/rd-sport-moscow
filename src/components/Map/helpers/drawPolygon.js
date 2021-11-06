import setPolygonClickEvent from './setPolygonClickEvent';

const createPolygon = (idx, coords = []) => {
    return new window.ymaps.Polygon(coords, {
        id: idx || new Date().getTime(),
    }, {
        editorDrawingCursor: "crosshair",
        editorMaxPoints: 15,
        fillColor: 'rgba(14,14,14,0.2)',
        strokeColor: '#0000FF',
        strokeWidth: 5
    });

}
const drawPolygon = (collection, button, populationFeatures, sportPointsObjectManagerObjects) => {
    const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
    const polygon = createPolygon();
    collection.add(polygon);

    var stateMonitor = new window.ymaps.Monitor(polygon.editor.state);
    stateMonitor.add("drawing", function (newValue) {
        polygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
    });

    polygon.editor.startDrawing();
    polygon.editor.events.add("drawingstop", function (e) {
        const idx = new Date().getTime();

        polygon.properties.set('id', idx);
        polygon.editor.stopDrawing();

        userPolygons.push({
            idx: idx,
            center: polygon.geometry.getBounds()[0],
            coords: polygon.geometry.getCoordinates()
        });

        setPolygonClickEvent(polygon, populationFeatures, sportPointsObjectManagerObjects);

        localStorage.setItem('userPolygons', JSON.stringify(userPolygons));

        button.deselect();
    });

    return polygon;
}

const removePolygon = (collection, polygon) => {
    const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
    const idx = polygon.properties.get('id');
    const newUserPolygons = userPolygons.filter(item => Number(item.idx) !== Number(idx));
    localStorage.setItem('userPolygons', JSON.stringify(newUserPolygons));
    collection.remove(polygon);
};

export { createPolygon, drawPolygon, removePolygon };
export default {};

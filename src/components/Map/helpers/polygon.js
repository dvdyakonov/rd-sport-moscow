const setPolygonData = (polygon, populationObjects, sportObjects ) => {
    const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];

    const sportObjectsInsidePolygon = window.ymaps.geoQuery(sportObjects).searchInside(polygon);
    const populationObjectsInsidePolygon = window.ymaps.geoQuery(populationObjects).searchInside(polygon);

    const data = {
        idx: polygon.properties.get('id'),
        coords: polygon.geometry.getCoordinates(),
        // Площадь полигона
        square: window.ymaps.util.calculateArea(polygon),
        // Кол-во жителей
        population: populationObjectsInsidePolygon._objects.reduce((res, cur) => {
            res += cur.properties.get('residents');
            return res;
        }, 0),
        // Информация по спортивным объектам
        sportObjects: {
            // Площадь спортивных объектов
            square: sportObjectsInsidePolygon._objects.reduce((res, cur) => {
                res += cur.properties.get('square');
                return res;
            }, 0),
            // Кол-во спортивных объектов
            length: sportObjectsInsidePolygon.getLength(),
            // Кол-во спортивных зон
            areas: sportObjectsInsidePolygon._objects.reduce((res, cur) => {
                res += cur.properties.get('areas');
                return res;
            }, 0),

        }
    }

    userPolygons.push(data);
    localStorage.setItem('userPolygons', JSON.stringify(userPolygons));

    return data;
}

const getPolygonData = (polygon) => {
    const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
    const polygonDataFromLocalStorage = userPolygons.find(item => Number(item.idx) === Number(polygon.properties.get('id')));

    return polygonDataFromLocalStorage;
}

const convertSquare = (square) => {
    return {
      value: square <= 1e6 ? square.toFixed(3) : (square / 1e6).toFixed(3),
      postfix: square <= 1e6 ? 'м²' : 'км²'
    };
  }

const showBaloon = (polygon) => {
    const data = getPolygonData(polygon);
    const dataSquare = convertSquare(data.square);
    const polygonId = polygon.properties.get('id');

    polygon.properties.set('balloonContentHeader', '<b style="margin-bottom: 12px;">Информация по выделенной области</b>');

    polygon.properties.set(
      'balloonContentBody',
      `<table style="width: 100%; margin-bottom: 12px;">
        <tr><td>Площадь выделенной области: </td><td style="text-align: right;">${convertSquare(Math.round(data.polygonSquare)).value} ${convertSquare(Math.round(data.polygonSquare)).postfix}</td></tr>
        ${data.objects && (
          `
          <tr><td>Число спортивных объектов: </td><td style="text-align: right;">${data.objects}</td></tr>
          <tr><td>Общая площадь спортивных объектов: </td><td style="text-align: right;">${dataSquare.value} ${dataSquare.postfix}</td></tr>
          `
        )}
        ${data.population && (
          `
            <tr><td>Примерное кол-во жителей: </td><td style="text-align: right;">${data.population}</td></tr>
          <tr><td>Плотность населения на 1 км²: </td><td style="text-align: right;">${(data.population/ ((data.polygonSquare / 1e6).toFixed(3))).toFixed(5)}</td></tr>
            <tr><td>Количество спортивных зон на 1 человека: </td><td style="text-align: right;">${(data.areas / data.population).toFixed(5)}</td></tr>
            <tr><td>Площадь спортивных зон на 1 человека: </td><td style="text-align: right;">${(dataSquare.value / data.population).toFixed(5)}</td></tr>
          `
        )}
      </table>
      <p><a href="/polygons/${polygonId}" style="float: left; text-decoration: none; margin-top: 0; font-size: 12px; line-height: 14px;
      background-color: #fff; padding: 4px 8px; color: #0000FF; font-family: 'Proxima Nova'; box-shadow: none; border: 1px solid #0000FF; border-radius: 4px; cursor: pointer;">Подробный отчет</a>
      <button data-id="${polygonId}" style="float: right; margin-top: 0; font-size: 12px; line-height: 14px;
              background-color: #fff; padding: 4px 8px; color: #cc2223; font-family: 'Proxima Nova'; box-shadow: none; border: 1px solid #cc2223; border-radius: 4px; cursor: pointer;">Удалить полигон</button></p>
      `
    )
}

export { setPolygonData, getPolygonData, showBaloon }
export default {}
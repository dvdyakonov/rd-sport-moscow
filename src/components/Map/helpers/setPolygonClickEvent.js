import getPopulation from './getPopulation';
import getPolygonInfo from './getPolygonInfo';

const convertSquare = (square) => {
  return {
    value: square <= 1e6 ? square.toFixed(3) : (square / 1e6).toFixed(3),
    postfix: square <= 1e6 ? 'м²' : 'км²'
  };
}

const setPolygonClickEvent = (polygon, populationFeatures, sportFeatures) => {
  const results = window.ymaps.geoQuery(populationFeatures).searchInside(polygon);
  const sportObjects = window.ymaps.geoQuery(sportFeatures).searchInside(polygon);

  const data = {
    population: getPopulation(results),
    ...getPolygonInfo(sportObjects)
  }

  const polygonSquare = convertSquare(Math.round(window.ymaps.util.calculateArea(polygon)));
  const dataSquare = convertSquare(data.square);

  polygon.properties.set('balloonContentHeader', '<b style="margin-bottom: 12px;">Информация по выделенной области</b>');

  polygon.properties.set(
    'balloonContentBody', 
    `<table style="width: 100%; margin-bottom: 12px;">
      <tr><td>Площадь выделенной области: </td><td style="text-align: right;">${polygonSquare.value} ${polygonSquare.postfix}</td></tr>
      ${data.objects && (
        `
        <tr><td>Число спортивных объектов: </td><td style="text-align: right;">${data.objects}</td></tr>
        <tr><td>Общая площадь спортивных объектов: </td><td style="text-align: right;">${dataSquare.value} ${dataSquare.postfix}</td></tr>
        `
      )}
      ${data.population && (
        `
          <tr><td>Примерное кол-во жителей: </td><td style="text-align: right;">${data.population}</td></tr>
          <tr><td>Плотность населения на 1 км²: </td><td style="text-align: right;">${(data.population/polygonSquare.value).toFixed(5)}</td></tr>
          <tr><td>Количество спортивных зон на 1 человека: </td><td style="text-align: right;">${(data.areas / data.population).toFixed(5)}</td></tr>
          <tr><td>Площадь спортивных зон на 1 человека: </td><td style="text-align: right;">${(dataSquare.value / data.population).toFixed(5)}</td></tr>
        `
      )}
    </table>`
  )
}

export default setPolygonClickEvent;

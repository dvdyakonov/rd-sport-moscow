import getPopulation from './getPopulation';

const setEventPolygon = (polygon, populationFeatures) => {
  polygon.events.add('click', () => {
    const results = window.ymaps.geoQuery(populationFeatures).searchInside(polygon);
    const population = getPopulation(results);
    polygon.properties.set('balloonContentBody', `<p>На данной территории проживает примерно ${population} человек</p>`)
  });
}

export default setEventPolygon;

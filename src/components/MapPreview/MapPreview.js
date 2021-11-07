import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPoints,
} from 'services/points/pointsSlice';
import populationPoints from 'config/population.json';
import './MapPreview.scss';
import { sportPointsConversion, populationPointsConversion, createPolygon } from '../Map/helpers';

const init = ({polygonData, sportFeatures, populationFeatures, map}) => {
  const ymaps = window.ymaps;
  
  // Инициализируем карту Москвы
  const myMap = new ymaps.Map(map.current, {
    center: [55.76, 37.64],
    zoom: 11,
  }, {});

  // Создаем менеджер объектов для точек спортивных объектов
  const sportPointsObjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 96,
    clusterDisableClickZoom: true
  });

  sportPointsObjectManager.objects.options.set('preset', 'islands#redDotIcon');
  sportPointsObjectManager.clusters.options.set('preset', 'islands#redClusterIcons');
  sportPointsObjectManager.add(sportFeatures);

  // Создаем менеджер объектов для плотности населения
  const populationPointsObjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 72,
    clusterDisableClickZoom: true
  });

  // Создаем менеджер объектов для плотности населения
  populationPointsObjectManager.add(populationFeatures);

  // Создаем коллекцию пользовательских объектов
  const userObjectCollection = new ymaps.GeoObjectCollection();
  const polygon = createPolygon(polygonData.idx, polygonData.coords);
  userObjectCollection.add(polygon)

  // Добавляем менеджеры объектов и коллекции объектов на карту
  // myMap.geoObjects.add(sportPointsObjectManager);
  myMap.geoObjects.add(userObjectCollection);

  // const populationObjects = window.ymaps.geoQuery(populationFeatures).searchInside(polygon);
  // const sportObjects = window.ymaps.geoQuery(sportFeatures).searchInside(polygon).addToMap(myMap);
};

const Map = ({ polygonData }) => {
  const points = useSelector(selectPoints);
  const [sportFeatures, setSportFeatures] = useState(() => sportPointsConversion(points));
  const [populationFeatures, setpopulationFeatures] = useState(() => populationPointsConversion(populationPoints));
  const mapRef = useRef(null);

  useEffect(() => {
    setSportFeatures(() => sportPointsConversion(points))
    setpopulationFeatures(() => populationPointsConversion(populationPoints))
  }, [points, populationPoints]);

  useEffect(() => {
    window.ymaps.ready(['util.calculateArea'], () => init({
      polygonData,
      sportFeatures,
      populationFeatures,
      map: mapRef,
    }));
  }, []);

  return (
    <>
      <div className="map-preview" ref={mapRef}></div>
    </>
  )
}

export default Map;

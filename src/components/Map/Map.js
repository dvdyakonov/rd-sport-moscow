import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPoints,
} from 'services/points/pointsSlice';
import { withYandexMap, withYandexHeatmap } from 'hocs';
import './Map.scss';
import { setMapInstance, setMapOptions } from 'services/map/mapSlice';

const Map = ({ isYmapsInit, mapData }) => {
  let points = useSelector(selectPoints);
  const dispatch = useDispatch();
  const map = useRef(null);
  const ymaps = window.ymaps;
  const features = {
    "type": "FeatureCollection",
    "features": points.map(point => (
      { "type": "Feature", "id": point.id, "geometry": { "type": "Point", "coordinates": point.coords }, "properties": { "balloonContentHeader": "<font size=3><b><a target='_blank' href='https://yandex.ru'>Здесь может быть ваша ссылка</a></b></font>", "balloonContentBody": "<p>Ваше имя: <input name='login'></p><p><em>Телефон в формате 2xxx-xxx:</em>  <input></p><p><input type='submit' value='Отправить'></p>", "balloonContentFooter": "<font size=1>Информация предоставлена: </font> <strong>этим балуном</strong>", "clusterCaption": "<strong><s>Еще</s> одна</strong> метка", "hintContent": "<strong>Текст  <s>подсказки</s></strong>" } }
    ))
  }

  function init() {
    var myMap = new ymaps.Map(map.current, {
      center: [55.76, 37.64],
      zoom: 10
    }, {
      searchControlProvider: 'yandex#search'
    });

    dispatch(setMapInstance(myMap));

    var objectManager = new ymaps.ObjectManager({
      // Чтобы метки начали кластеризоваться, выставляем опцию.
      clusterize: true,
      // ObjectManager принимает те же опции, что и кластеризатор.
      gridSize: 64,
      clusterDisableClickZoom: true
    });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    // objectManager.add(features);

    const gradients = [{
      0.1: 'rgba(128, 255, 0, 0.7)',
      0.2: 'rgba(255, 255, 0, 0.8)',
      0.7: 'rgba(234, 72, 58, 0.9)',
      1.0: 'rgba(162, 36, 25, 1)'
    }]
    const radiuses = [5, 10, 20, 30];
    const opacities = [0.4, 0.6, 0.8, 1];

    

    ymaps.modules.require(['Heatmap'], function (Heatmap) {
      var heatmap = new Heatmap(features, {
        gradient: gradients[0],
        radius: radiuses[1],
        opacity: opacities[2]
      });
      heatmap.setMap(myMap);

    })
  }

  useEffect(() => {
    if (isYmapsInit) {
      ymaps.ready(init);
    }
  }, [isYmapsInit]);

  return (
    <div className="map" ref={map}></div>
  )
}

export default withYandexMap(Map);

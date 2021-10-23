import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPoints,
} from 'services/points/pointsSlice';
import { withYandexMap } from 'hocs';
import './Map.scss';

const init = (features, map) => {
  const ymaps = window.ymaps;
  const myMap = new ymaps.Map(map.current, {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl', 'typeSelector',  'fullscreenControl'],
  }, {
    searchControlProvider: 'yandex#search'
  });

  var objectManager = new ymaps.ObjectManager({
    // Чтобы метки начали кластеризоваться, выставляем опцию.
    clusterize: true,
    // ObjectManager принимает те же опции, что и кластеризатор.
    gridSize: 72,
    clusterDisableClickZoom: true
  });

  // Чтобы задать опции одиночным объектам и кластерам,
  // обратимся к дочерним коллекциям ObjectManager.
  objectManager.objects.options.set('preset', 'islands#greenDotIcon');
  objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
  myMap.geoObjects.add(objectManager);

  const gradients = [{
    .1: "rgba(0, 255, 0, 0.5)",
    .2: "rgba(173, 255, 47, 0.5)",
    .4: "rgba(255, 255, 0, 0.8)",
    .6: "rgba(255, 165, 0, 0.8)",
    .8: "rgba(234, 72, 58, 0.8)",
    1: "rgba(162, 36, 25, 0.8)"
  },{
    0.1: 'rgba(55, 255, 0, 0.7)',
    0.2: 'rgba(55, 255, 0, 0.8)',
    0.7: 'rgba(55, 72, 58, 0.9)',
    1.0: 'rgba(55, 36, 25, 1)'
  }
  ]
  const radiuses = [5, 10, 20, 30];
  const opacities = [0.4, 0.6, 0.8, 1];

  ymaps.modules.require(['Heatmap'], function (Heatmap) {
    var heatmapSport = new Heatmap(features, {
      gradient: gradients[0],
      radius: radiuses[1],
      opacity: opacities[2]
    });

    var heatmapDensity = new Heatmap(features, {
      gradient: gradients[1],
      radius: radiuses[1],
      opacity: opacities[2]
    });

      // Создадим переключатель вида подписей.
    var typeList = new ymaps.control.ListBox({
      data: {
          content: 'Тепловая карта'
      },
      items: [
          new ymaps.control.ListBoxItem({data: {content: 'Спортивные объекты'}}),
          new ymaps.control.ListBoxItem({data: {content: 'Население Москвы'}})
      ]
    });

    typeList.get(0).events.add('click', function (e) {
      const item = e.get('target');
      const itemSelected = item.state.get('selected');

      heatmapSport.setMap(
        itemSelected ? null : myMap
      );
      // Закрываем список.
      typeList.collapse();
    });

    typeList.get(1).events.add('click', function (e) {
      const item = e.get('target');
      const itemSelected = item.state.get('selected');

      heatmapDensity.setMap(
        itemSelected ? null : myMap
      );
      // Закрываем список.
      typeList.collapse();
    });

    myMap.controls.add(typeList, {floatIndex: 0})
  })
}

const Map = ({ isYmapsInit, mapData }) => {
  const points = useSelector(selectPoints);
  const featuresFunc = (points) => ({
    "type": "FeatureCollection",
    "features": points.map(point => (
      {
        "type": "Feature",
        "id": point.id,
        "geometry": {
          "type": "Point",
          "coordinates": point.coords
        },
        "properties": {
          "balloonContentHeader": "<font size=3><b><a target='_blank' href='https://yandex.ru'>Здесь может быть ваша ссылка</a></b></font>", "balloonContentBody": "<p>Ваше имя: <input name='login'></p><p><em>Телефон в формате 2xxx-xxx:</em>  <input></p><p><input type='submit' value='Отправить'></p>", "balloonContentFooter": "<font size=1>Информация предоставлена: </font> <strong>этим балуном</strong>", "clusterCaption": "<strong><s>Еще</s> одна</strong> метка", "hintContent": "<strong>Текст  <s>подсказки</s></strong>"
        }
      }
    ))
  });

  const [features, setFeatures] = useState(() => featuresFunc(points));
  const mapRef = useRef(null);
  const ymaps = window.ymaps;

  useEffect(() => {
    setFeatures(() => featuresFunc(points))
  }, [points]);

  useEffect(() => {
    if (isYmapsInit) {
      ymaps.ready(() => init(features, mapRef));
    }
  }, [isYmapsInit, features, ymaps]);

  return (
    <div className="map" ref={mapRef}></div>
  )
}

export default withYandexMap(Map);

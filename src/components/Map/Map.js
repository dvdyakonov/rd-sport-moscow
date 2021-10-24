import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPoints,
} from 'services/points/pointsSlice';
import populationPoints from 'config/population.json';
import { withYandexMap } from 'hocs';
import './Map.scss';

const update = ({ sportFeatures, populationFeatures, objManager } ) => {
  objManager.removeAll();
  objManager.add(sportFeatures);
}

const init = ({sportFeatures, populationFeatures, map, objManager, setObjManager, setPoly }) => {
  const ymaps = window.ymaps;
  const myMap = new ymaps.Map(map.current, {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
  }, {
    searchControlProvider: 'yandex#search'
  });

  // Рисуем полигон

  // Создаем многоугольник без вершин.
  var myPolygon = new ymaps.Polygon([], {}, {
      // Курсор в режиме добавления новых вершин.
      editorDrawingCursor: "crosshair",
      // Максимально допустимое количество вершин.
      editorMaxPoints: 5,
      // Цвет заливки.
      fillColor: 'rgba(14,14,14,0.2)',
      // Цвет обводки.
      strokeColor: '#0000FF',
      // Ширина обводки.
      strokeWidth: 5
  });
  // Добавляем многоугольник на карту.
  myMap.geoObjects.add(myPolygon);

  // В режиме добавления новых вершин меняем цвет обводки многоугольника.
  var stateMonitor = new ymaps.Monitor(myPolygon.editor.state);
  stateMonitor.add("drawing", function (newValue) {
      myPolygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
  });

  setPoly(myPolygon);

  const objectManager = new ymaps.ObjectManager({
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
  objectManager.add(sportFeatures);

  const gradients = [{
    .1: "rgba(0, 255, 0, 0.5)",
    .2: "rgba(173, 255, 47, 0.5)",
    .4: "rgba(255, 255, 0, 0.8)",
    .6: "rgba(255, 165, 0, 0.8)",
    .8: "rgba(234, 72, 58, 0.8)",
    1: "rgba(162, 36, 25, 0.8)"
  }, {
    .1: "rgba(0, 255, 0, 0.5)",
    .2: "rgba(173, 255, 47, 0.5)",
    .4: "rgba(255, 255, 0, 0.8)",
    .6: "rgba(255, 165, 0, 0.8)",
    .8: "rgba(234, 72, 58, 0.8)",
    1: "rgba(162, 36, 25, 0.8)"
  }
  ]
  const radiuses = [5, 10, 20, 30];
  const opacities = [0.4, 0.6, 0.8, 1];


  ymaps.modules.require(['Heatmap'], function (Heatmap) {
    var heatmapSport = new Heatmap(sportFeatures, {
      gradient: gradients[0],
      radius: radiuses[1],
      intensityOfMidpoint: .01,
      opacity: opacities[2]
    });

    var heatmapPopulation = new Heatmap(populationFeatures, {
      radius: 15,
      dissipating: !0,
      intensityOfMidpoint: .01,
      gradient: {
        .1: "rgba(0, 255, 0, 0.5)",
        .2: "rgba(173, 255, 47, 0.5)",
        .4: "rgba(255, 255, 0, 0.8)",
        .6: "rgba(255, 165, 0, 0.8)",
        .8: "rgba(234, 72, 58, 0.8)",
        1: "rgba(162, 36, 25, 0.8)"
      }
    });

    myMap.events.add("actionend", (function () {
      switch (myMap.action.getCurrentState().zoom) {
        case 11:
          heatmapPopulation.options.set("intensityOfMidpoint", .015);
          break;
        case 12:
          heatmapPopulation.options.set("intensityOfMidpoint", .03);
          break;
        case 13:
          heatmapPopulation.options.set("intensityOfMidpoint", .06);
          break;
        case 14:
          heatmapPopulation.options.set("intensityOfMidpoint", .15);
          break;
        case 15:
          heatmapPopulation.options.set("intensityOfMidpoint", .3);
          break;
        case 16:
          heatmapPopulation.options.set("intensityOfMidpoint", .5);
          break;
        default:
          heatmapPopulation.options.set("intensityOfMidpoint", .005);
          break;
      }
    }));

    // Создадим переключатель вида подписей.
    var typeList = new ymaps.control.ListBox({
      data: {
        content: 'Тепловая карта'
      },
      items: [
        new ymaps.control.ListBoxItem({ data: { content: 'Спортивные объекты' } }),
        new ymaps.control.ListBoxItem({ data: { content: 'Население Москвы' } })
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

      heatmapPopulation.setMap(
        itemSelected ? null : myMap
      );
      // Закрываем список.
      typeList.collapse();
    });

    myMap.controls.add(typeList, {floatIndex: 0});
    if (!objManager) {
      setObjManager(objectManager);
    };
  })
};

const Map = ({ isYmapsInit }) => {
  const points = useSelector(selectPoints);
  const [objManager, setObjManager] = useState(null);
  const [draw, setDraw] = useState(false);
  const [poly, setPoly] = useState(null);

  const polygonToggle = () => {
    if (draw) {
      poly.editor.stopDrawing();
      setDraw(false);
    } else {
      poly.editor.startDrawing();
      setDraw(true);
    }
  }

  const sportPointsConversion = (points) => ({
    "type": "FeatureCollection",
    "features": points.map(point => (
      {
        "type": "Feature",
        "id": point.value,
        "geometry": {
          "type": "Point",
          "coordinates": point.coords
        },
        "properties": {
          "balloonContentHeader": "<font size=3><b><a target='_blank' href='https://yandex.ru'>Здесь может быть ваша ссылка</a></b></font>",
          "balloonContentBody": "<p>Ваше имя: <input name='login'></p><p><em>Телефон в формате 2xxx-xxx:</em>  <input></p><p><input type='submit' value='Отправить'></p>",
          "balloonContentFooter": "<font size=1>Информация предоставлена: </font> <strong>этим балуном</strong>",
          "clusterCaption": "<strong><s>Еще</s> одна</strong> метка",
          "hintContent": "<strong>Текст  <s>подсказки</s></strong>",
          "radius": point.radius
        }
      }
    ))
  });

  const populationPointsConversion = (points) => ({
    "type": "FeatureCollection",
    "features": points.map(point => (
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [Number(point.lat), Number(point.lon)]
        },
        "properties": {
          "weight": Number(point.weight),
          "residents": Number(point.weight) * 31
        }
      }
    ))
  });

  const [sportFeatures, setSportFeatures] = useState(() => sportPointsConversion(points));
  const [populationFeatures, setpopulationFeatures] = useState(() => populationPointsConversion(populationPoints));
  const mapRef = useRef(null);
  const ymaps = window.ymaps;

  useEffect(() => {
    setSportFeatures(() => sportPointsConversion(points))
    setpopulationFeatures(() => populationPointsConversion(populationPoints))
  }, [points, populationPoints]);

  useEffect(() => {
    if (isYmapsInit) {
      if (objManager) {
        update({
          sportFeatures,
          populationFeatures,
          objManager
        });
      } else {
        ymaps.ready(() => init({
          sportFeatures,
          populationFeatures,
          map: mapRef,
          objManager,
          setObjManager,
          setPoly,
        }));
      }
    }
  }, [isYmapsInit, sportFeatures, populationFeatures, ymaps]);

  return (
    <>
      <div className="map" ref={mapRef}></div>
      <button className="polyBtn" onClick={polygonToggle}>Poly</button>
    </>
  )
}

export default withYandexMap(Map);

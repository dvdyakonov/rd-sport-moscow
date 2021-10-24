import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPoints,
} from 'services/points/pointsSlice';
import populationPoints from 'config/population.json';
<<<<<<< HEAD
import typesOfAreas from 'config/typesOfAreas.json';
import kindsOfSports from 'config/kindsOfSports.json';
import departments from 'config/departments.json';
import regions from 'config/regions.json';
=======
>>>>>>> master
import { withYandexMap } from 'hocs';
import { drawCircle, getPopulation, getSquare, setPolygonColor, sportPointsConversion, populationPointsConversion } from './helpers';
import './Map.scss';

const update = ({ sportFeatures, populationFeatures, sportObjManager } ) => {
  sportObjManager.removeAll();
  sportObjManager.add(sportFeatures);
}

const init = ({sportFeatures, populationFeatures, map, sportObjManager, setSportObjManager, setPoly }) => {
  const ymaps = window.ymaps;
  // Инициализируем карту Москвы
  const myMap = new ymaps.Map(map.current, {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
  }, {
    searchControlProvider: 'yandex#search'
  });


  // Создаем менеджер объектов для точек спортивных объектов
  const sportPointsObjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 96,
    clusterDisableClickZoom: true
  });

  sportPointsObjectManager.objects.options.set('preset', 'islands#redDotIcon');
  sportPointsObjectManager.clusters.options.set('preset', 'islands#redClusterIcons');
  sportPointsObjectManager.add(sportFeatures);
  if (!sportObjManager) {
    setSportObjManager(sportPointsObjectManager);
  };

  // sportPointsObjectManager.objects.events.add('click', (e) => {
  window.document.addEventListener('click', (e) => {
    if (e.target.id.indexOf('balloon-btn-') !== -1) {
      const objectId = Number(e.target.id.slice('balloon-btn-'.length));
      const point = sportPointsObjectManager.objects.getById(objectId);
      const circle = drawCircle(point.geometry.coordinates, point.properties.radius);
      myMap.geoObjects.add(circle);

      const results = ymaps.geoQuery(populationFeatures).searchInside(circle);
      const sportObjects = ymaps.geoQuery(sportPointsObjectManager.objects).searchInside(circle);
      const population = getPopulation(results);
      const square = getSquare(sportObjects);
      setPolygonColor(circle, square);

      circle.properties.set('hintContent', `<p>Проживает: ${population} человек,</p><p>Площадь спортивных зон: ${square}</p>`)
    }
  })

  // Создаем менеджер объектов для плотности населения
  const populationPointsObjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 72,
    clusterDisableClickZoom: true
  });

  populationPointsObjectManager.add(populationFeatures);

  const userPolygonsObjectManager = new ymaps.ObjectManager();

  // Создаем многоугольник без вершин.
  var myPolygon = new ymaps.Polygon([], {}, {
      editorDrawingCursor: "crosshair",
      editorMaxPoints: 15,
      fillColor: 'rgba(14,14,14,0.2)',
      strokeColor: '#0000FF',
      strokeWidth: 5
  });

  // userPolygonsObjectManager.add(myPolygon);


  // Добавляем менеджеры объектов на карту
  myMap.geoObjects.add(sportPointsObjectManager);
  myMap.geoObjects.add(myPolygon);

  // В режиме добавления новых вершин меняем цвет обводки многоугольника.
  var stateMonitor = new ymaps.Monitor(myPolygon.editor.state);
  stateMonitor.add("drawing", function (newValue) {
      myPolygon.options.set("strokeColor", newValue ? '#FF0000' : '#0000FF');
  });

  setPoly(myPolygon);


  ymaps.modules.require(['Heatmap'], function (Heatmap) {
    var heatmapSport = new Heatmap(sportFeatures, {
      gradient: {
        .1: "rgba(0, 255, 0, 0.5)",
        .2: "rgba(173, 255, 47, 0.5)",
        .4: "rgba(255, 255, 0, 0.8)",
        .6: "rgba(255, 165, 0, 0.8)",
        .8: "rgba(234, 72, 58, 0.8)",
        1: "rgba(162, 36, 25, 0.8)"
      },
      radius: 15,
      intensityOfMidpoint: .01,
    });

    var heatmapPopulation = new Heatmap(populationFeatures, {
      radius: 15,
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
        content: 'Слои'
      },
      items: [
        new ymaps.control.ListBoxItem({ data: { content: 'Точки спортивных объектов' } , state: { selected: true }}),
        new ymaps.control.ListBoxItem({ data: { content: 'Тепловая карта спортивных объектов' } }),
        new ymaps.control.ListBoxItem({ data: { content: 'Тепловая карта плотности населения' } })
      ]
    });

    typeList.get(0).events.add('click', function (e) {
      const item = e.get('target');
      const itemSelected = item.state.get('selected');
      if (itemSelected) {
        myMap.geoObjects.remove(sportPointsObjectManager);
      } else {
        myMap.geoObjects.add(sportPointsObjectManager);
      }
      // Закрываем список.
      typeList.collapse();
    });

    typeList.get(1).events.add('click', function (e) {
      const item = e.get('target');
      const itemSelected = item.state.get('selected');

      heatmapSport.setMap(
        itemSelected ? null : myMap
      );
      // Закрываем список.
      typeList.collapse();
    });

    typeList.get(2).events.add('click', function (e) {
      const item = e.get('target');
      const itemSelected = item.state.get('selected');

      heatmapPopulation.setMap(
        itemSelected ? null : myMap
      );
      // Закрываем список.
      typeList.collapse();
    });

    myMap.controls.add(typeList, {floatIndex: 0});
  })
};

const Map = ({ isYmapsInit }) => {
  const points = useSelector(selectPoints);
  const [sportObjManager, setSportObjManager] = useState(null);
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
      if (sportObjManager) {
        update({
          sportFeatures,
          populationFeatures,
          sportObjManager
        });
      } else {
        ymaps.ready(() => init({
          sportFeatures,
          populationFeatures,
          map: mapRef,
          sportObjManager,
          setSportObjManager,
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

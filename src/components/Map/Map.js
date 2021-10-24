import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'lodash';
import {
  selectPoints,
} from 'services/points/pointsSlice';
import populationPoints from 'config/population.json';
import typesOfAreas from 'config/typesOfAreas.json';
import kindsOfSports from 'config/kindsOfSports.json';
import departments from 'config/departments.json';
import { withYandexMap } from 'hocs';
import { drawCircle, getPopulation, getSquare, setPolygonColor } from './helpers';
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

  sportPointsObjectManager.objects.options.set('preset', 'islands#greenDotIcon');
  sportPointsObjectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
  sportPointsObjectManager.add(sportFeatures);
  if (!sportObjManager) {
    setSportObjManager(sportPointsObjectManager);
  };

  sportPointsObjectManager.objects.events.add('click', (e) => {
    const point = sportPointsObjectManager.objects.getById(e.get('objectId'));
    console.log(point.properties);
    const circle = drawCircle(point.geometry.coordinates, point.properties.radius);
    myMap.geoObjects.add(circle);

    // console.log(ymaps.geoQuery(populationFeatures).searchInside(circle));
    const results = ymaps.geoQuery(populationFeatures).searchInside(circle);
    const sportObjects = ymaps.geoQuery(sportPointsObjectManager.objects).searchInside(circle);
    const population = getPopulation(results);
    const square = getSquare(sportObjects);
    setPolygonColor(circle, square);
    console.log(`Проживает: ${population} человек, Площадь спортивных зон: ${square}`);

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
          "balloonContentHeader": `<b style="margin-bottom: 12px;">${point.label}</b>`,
          "balloonContentBody": `
            <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Ведомство:</b> ${departments.find(item => item.value === point.departmentId).label}</p>
            <table style="width: 100%; margin-bottom: 12px;">
              <tr><th><b style="font-weight: bold;">Наименование спортзоны</b></th><th style="text-align: right;"><b style="font-weight: bold;">Площадь</b></th></th>
              ${point.areasItems.map((item) => `<tr><td>${item.label}</td><td style="text-align: right;">${item.square} м2</td></tr>`).join('')}
            </table>
            <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Типы спортивных зон:</b> ${uniq(point.areasItems.map((item) => (typesOfAreas.find(type => type.value === item.typeId).label))).join(', ')}</p>
            <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Виды спорта на объекте:</b> ${uniq(point.areasItems.reduce((res, cur) => {
                cur.kindIds.forEach((item) => {
                  const obj = kindsOfSports.find(kind => kind.value === item);
                  obj && res.push(obj.label);
                });
                return res;
              }, [])).join(', ')}</p>
              <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Доступность: ${point.radius} м. <button>построить окружность</button></b></p>
          `,
          "balloonContentFooter": `<p><b style="font-weight: bold;">Адрес:</b> ${point.address}</p>`,
          "clusterCaption": `<strong>${point.label}</strong>`,
          "radius": point.radius,
          "square": point.areasItems.reduce((res, cur) => {
            res += cur.square;
            return res;
          }, 0)
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

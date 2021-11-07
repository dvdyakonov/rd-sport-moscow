import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPoints,
  selectPolygons,
  setPolygons
} from 'services/points/pointsSlice';
import populationPoints from 'config/population.json';
import districtsPolygons from 'config/districts.json';
import { drawCircle, drawPolygon,removePolygon, setPolygonClickEvent, getPopulation, getPolygonInfo, setPolygonColor, sportPointsConversion, populationPointsConversion, createPolygon } from './helpers';
import './Map.scss';
import { showBalloon } from './helpers/polygon';

const update = ({ sportFeatures, populationFeatures, sportObjManager, polygonList, polygonCollection, setPolygonList, setPolygonCollection, heatmapInstance, layers }) => {
  sportObjManager.removeAll();
  sportObjManager.add(sportFeatures);

  heatmapInstance.setData(sportFeatures);

  if (layers[4]) {
    polygonCollection.removeAll();

    polygonList.forEach(item => {
      const polygon = createPolygon(item.idx, item.coords);
      polygonCollection.add(polygon);
      setPolygonClickEvent(polygon, populationFeatures, sportObjManager.objects);
    });

    const updatedPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
    setPolygonList(updatedPolygons);
    setPolygonCollection(polygonCollection);
  }
}

const init = ({ sportFeatures, populationFeatures, map, sportObjManager, setSportObjManager, setPolygonList, setPolygonCollection, setHeatmapInstance, layers, setLayers }) => {
  const ymaps = window.ymaps;
  const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
  // Инициализируем карту Москвы
  const myMap = new ymaps.Map(map.current, {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
  }, {
    searchControlProvider: 'yandex#search'
  });

  const buttons = {
    polygon: new ymaps.control.Button({
      data: {
        content: 'Создать полигон',
      },
      options: {
        selectOnClick: true,
        maxWidth: 150
      }
    })
  }

  buttons.polygon.events.add('press', () => {
    drawPolygon(userObjectCollection, buttons.polygon, populationFeatures, sportPointsObjectManager.objects, setPolygonList)
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

  myMap.geoObjects.add(sportPointsObjectManager);

  // Создаем коллекцию пользовательских объектов
  const userObjectCollection = new ymaps.GeoObjectCollection();

  // Добавляем менеджеры объектов и коллекции объектов на карту
  myMap.geoObjects.add(userObjectCollection);

  // Создаем менеджер объектов для плотности населения
  const populationPointsObjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 72,
    clusterDisableClickZoom: true
  });

  // Создаем менеджер объектов для плотности населения
  const districtsPolygonsObjectManager = new ymaps.ObjectManager();

  populationPointsObjectManager.add(populationFeatures);
  districtsPolygonsObjectManager.add(districtsPolygons);

  userPolygons.forEach(item => {
    userObjectCollection.add(createPolygon(item.idx, item.coords));
  })

  const updatedPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
  setPolygonList(updatedPolygons);
  setPolygonCollection(userObjectCollection);
  userObjectCollection.events.add('click', (e) => {
    const polygon = e.get('target');
    showBalloon(polygon);
  })

  myMap.controls.add(buttons.polygon);

  const Heatmap = ymaps.Heatmap;

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

  setHeatmapInstance(heatmapSport);

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
      new ymaps.control.ListBoxItem({ data: { content: 'Точки спортивных объектов' }, state: { selected: layers[0] } }),
      new ymaps.control.ListBoxItem({ data: { content: 'Тепловая карта спортивных объектов' }, state: { selected: layers[1] } }),
      new ymaps.control.ListBoxItem({ data: { content: 'Тепловая карта плотности населения' }, state: { selected: layers[2] } }),
      new ymaps.control.ListBoxItem({ data: { content: 'Границы районов' }, state: { selected: layers[3] } }),
      new ymaps.control.ListBoxItem({ data: { content: 'Пользовательские полигоны' }, state: { selected: layers[4] } }),
    ]
  });

  typeList.get(0).events.add('click', function (e) {
    const item = e.get('target');
    const itemSelected = item.state.get('selected');
    if (itemSelected) {
      myMap.geoObjects.remove(sportPointsObjectManager);
      const newLayers = layers.map((item, index) => {
        if(index === 0) item = false;
        return item;
      })
      setLayers(newLayers);
    } else {
      myMap.geoObjects.add(sportPointsObjectManager);
      const newLayers = layers.map((item, index) => {
        if(index === 0) item = true;
        return item;
      })
      setLayers(newLayers);
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

    if (itemSelected) {
      const newLayers = layers.map((item, index) => {
        if(index === 1) item = false;
        return item;
      })
      setLayers(newLayers);
    } else {
      const newLayers = layers.map((item, index) => {
        if(index === 1) item = true;
        return item;
      })
      setLayers(newLayers);
    }
    // Закрываем список.
    typeList.collapse();
  });

  typeList.get(2).events.add('click', function (e) {
    const item = e.get('target');
    const itemSelected = item.state.get('selected');

    heatmapPopulation.setMap(
      itemSelected ? null : myMap
    );

    if (itemSelected) {
      const newLayers = layers.map((item, index) => {
        if(index === 2) item = false;
        return item;
      })
      setLayers(newLayers);
    } else {
      const newLayers = layers.map((item, index) => {
        if(index === 2) item = true;
        return item;
      })
      setLayers(newLayers);
    }
    // Закрываем список.
    typeList.collapse();
  });

  typeList.get(3).events.add('click', function (e) {
    const item = e.get('target');
    const itemSelected = item.state.get('selected');
    if (itemSelected) {
      myMap.geoObjects.remove(districtsPolygonsObjectManager);
      const newLayers = layers.map((item, index) => {
        if(index === 3) item = false;
        return item;
      })
      setLayers(newLayers);
    } else {
      myMap.geoObjects.add(districtsPolygonsObjectManager);
      const newLayers = layers.map((item, index) => {
        if(index === 3) item = true;
        return item;
      })
      setLayers(newLayers);
    }
    // Закрываем список.
    typeList.collapse();
  });

  typeList.get(4).events.add('click', function (e) {
    const item = e.get('target');
    const itemSelected = item.state.get('selected');
    if (itemSelected) {
      myMap.geoObjects.remove(userObjectCollection);
      const newLayers = layers.map((item, index) => {
        if(index === 4) item = false;
        return item;
      })
      setLayers(newLayers);
    } else {
      myMap.geoObjects.add(userObjectCollection);
      const newLayers = layers.map((item, index) => {
        if(index === 4) item = true;
        return item;
      })
      setLayers(newLayers);
    }
    // Закрываем список.
    typeList.collapse();
  });


  myMap.controls.add(typeList, { floatIndex: 0 });

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
      const data = getPolygonInfo(sportObjects);
      setPolygonColor(circle, data.square);

      circle.properties.set('hintContent', `<p>Проживает: ${population} человек,</p><p>Площадь спортивных зон: ${data.square}</p>`)
    }

    if (e.target.dataset.id) {
      userObjectCollection.each(item => {
        if (item.properties.get('id') === Number(e.target.dataset.id)) {
          removePolygon(userObjectCollection, item, setPolygonList);
        }
      })
    }
  })
};

const Map = () => {
  const points = useSelector(selectPoints);
  const polygonList = useSelector(selectPolygons);
  const dispatch = useDispatch();
  const setPolygonList = (arr) => dispatch(setPolygons(arr));
  const [polygonCollection, setPolygonCollection] = useState(null);
  const [layers, setLayers] = useState([true, false, false, false, true]);
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [sportObjManager, setSportObjManager] = useState(null);
  const [sportFeatures, setSportFeatures] = useState(() => sportPointsConversion(points));
  const [populationFeatures, setpopulationFeatures] = useState(() => populationPointsConversion(populationPoints));
  const mapRef = useRef(null);
  const ymaps = window.ymaps;

  useEffect(() => {
    setSportFeatures(() => sportPointsConversion(points))
    setpopulationFeatures(() => populationPointsConversion(populationPoints))
  }, [points, populationPoints]);

  useEffect(() => {
    if (sportObjManager) {
      update({
        sportFeatures,
        populationFeatures,
        sportObjManager,
        polygonCollection,
        polygonList,
        setPolygonList,
        setPolygonCollection,
        heatmapInstance,
        layers
      });
    }
  }, [sportFeatures, populationFeatures, ymaps]);

  useEffect(() => {
    ymaps.ready(['util.calculateArea', 'Heatmap'], () => init({
      sportFeatures,
      populationFeatures,
      map: mapRef,
      sportObjManager,
      setSportObjManager,
      setPolygonList,
      setPolygonCollection,
      setHeatmapInstance,
      layers,
      setLayers
    }));
  }, []);

  return (
    <>
      <div className="map" ref={mapRef}></div>
    </>
  )
}

export default Map;

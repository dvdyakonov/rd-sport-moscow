import React, { useState, useEffect } from 'react';
import qs from "qs";
import { useLocation } from "react-router-dom";
import points from '../config/points.json';
import { getDistance, jsonp } from "../utils";
import Aside from '../components/Aside';
import YandexMap from '../components/YandexMap';

const Home = () => {
  const location = useLocation();
  const [map, setMapInstance] = useState();
  const [objectType, objectTypeToggle] = useState('points');  // points or events
  const [asideType, setAsideType] = useState('default');
  const [mapData, setMapData] = useState({
    coords: [55.751244, 37.618423],
    name: 'Москва',
    zoom: 10,
    distance: 0.5,
  });

  useEffect(() => {
    // Забираем данные из адреса
    const mapDataFromUrl = qs.parse(location.search.slice(1));
    const requiredKeys = Object.keys(mapDataFromUrl).filter(item => ['coords', 'name', 'zoom', 'distance'].indexOf(item) !== -1);
    if(requiredKeys.length === 4 && parseInt(mapDataFromUrl.distance) <= 2) {
      setMapData(mapDataFromUrl); // Данные уже введены, отправляем на второй шаг
    }
  }, []);

  const filteredPoints = points.filter((item) => {
    const pointDistance = getDistance(mapData.coords, item.coords);
    if (pointDistance < mapData.distance) {
      item.distance = pointDistance;
      return true;
    }
    return false;
  });


  return (
    <main className="main">
      {map && <Aside type={asideType} setMapData={setMapData} currentMap={map} objectType={objectType} objectTypeToggle={objectTypeToggle} />}
      <YandexMap points={filteredPoints} mapData={mapData} setMapInstance={setMapInstance} />
    </main>
  )
}

export default Home;
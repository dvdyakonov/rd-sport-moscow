import React, { useState, useEffect } from 'react';
import qs from "qs";
import { useLocation } from "react-router-dom";

import { getDistance } from "utils";
import Aside from 'components/Aside';
import YandexMap from 'components/YandexMap';
import Filters from 'components/Filters';

const Home = () => {
  const location = useLocation();
  const [map, setMapInstance] = useState();
  const [showEvents, showEventsToggle] = useState(false);  // points or events
  const [asideType, setAsideType] = useState('default');
  const [mapData, setMapData] = useState({
    coords: [55.751244, 37.618423],
    name: 'Москва',
    zoom: 10,
    distance: 0.5,
  });



  // useEffect(() => {
  //   // Забираем данные из адреса
  //   const mapDataFromUrl = qs.parse(location.search.slice(1));
  //   const requiredKeys = Object.keys(mapDataFromUrl).filter(item => ['coords', 'name', 'zoom', 'distance'].indexOf(item) !== -1);
  //   if(requiredKeys.length === 4 && parseInt(mapDataFromUrl.distance) <= 2) {
  //     setMapData(mapDataFromUrl); // Данные уже введены
  //   }
  // }, []);

  // const filteredPoints = points.filter((item) => {
  //   const pointDistance = getDistance(mapData.coords, item.coords);
  //   if (pointDistance < mapData.distance) {
  //     item.distance = pointDistance;
  //     return true;
  //   }
  //   return false;
  // });

  return (
    <main className="main">
      {map && <Aside />}
      <YandexMap mapData={mapData} setMapInstance={setMapInstance} />
    </main>
  )
}

export default Home;

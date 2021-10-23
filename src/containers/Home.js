import React from 'react';
// import { useLocation } from "react-router-dom";
import Aside from 'components/Aside';
import Map from 'components/Map';

const Home = () => {

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
      <Aside />
      <Map />
    </main>
  )
}

export default Home;

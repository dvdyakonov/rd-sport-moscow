import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import cx from 'classnames';
import qs from "qs";
import firebase from "firebase/compat/app";
import Modal from 'react-modal';

import { firebaseConfig } from './config/app.json';
import points from './config/points.json';
import './App.scss';

// Components
import Header from "./components/Header";
import Aside from "./components/Aside";
import Loader from "./components/Loader";
import Auth from "./components/Auth";
import SearchForm from "./components/SearchForm";
import YandexMap from "./components/YandexMap";
import Results from "./components/Results";

import { getDistance, jsonp } from "./utils";

import "firebase/compat/analytics";
import "firebase/compat/database";
import "firebase/compat/auth";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Расширяем данные о пользователе
let profile = {};
jsonp("https://api.ipify.org?format=jsonp", {
  onSuccess: (data) => { profile = data }
});


const App = () => {
  // const [points, setPoints] = useState([]);
  const location = useLocation();
  const [user, setUserData] = useState({});
  const [isAuthPopupVisible, showAuthPopup] = useState(false);
  const [isResultsHidden, toggleResults] = useState(false);
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

    // Проверяем авторизован ли пользователь
    firebase.auth().onAuthStateChanged(userAuth => {
      if (userAuth) {
        firebase.database().ref(`users/${userAuth.uid}`).update(profile);

        setUserData({
          uid: userAuth.uid,
          email: userAuth.email,
        });
      } else {
        firebase.auth().signInAnonymously();
      }
    });

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
    <>
      <div className={`app`}>
        <Header setMapData={setMapData} toggleResults={toggleResults} isResultsHidden={isResultsHidden}/>
        <main className="main">
          {map && <Aside type={asideType} setMapData={setMapData} currentMap={map} objectType={objectType} objectTypeToggle={objectTypeToggle} />}
          <YandexMap points={filteredPoints} mapData={mapData} setMapInstance={setMapInstance} />
        </main>
      </div>
    </>
  )
}

export default App;

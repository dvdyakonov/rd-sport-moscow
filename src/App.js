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
// import Footer from "./components/Footer";
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
  const [step, setStep] = useState(0);
  const [map, setMapInstance] = useState();
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
      setMapData(mapDataFromUrl, setStep(1)); // Данные уже введены, отправляем на второй шаг
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
    <div className={`app step${step}`}>
      <Header setMapData={setMapData} setStep={setStep} toggleResults={toggleResults} isResultsHidden={isResultsHidden}/>
      {user.uid ? (
        <div className={cx('block', 'block--overlay', { [`block--hidden`]: isResultsHidden })}>
          <div className="block__content">
          {step === 0 && map && (
            <SearchForm currentMap={map} setMapData={setMapData} setStep={setStep}/>
          )}

          {step === 1 && (
            <>
              <Results isResultsHidden={isResultsHidden} user={user} data={mapData} points={filteredPoints} setStep={setStep} showAuthPopup={showAuthPopup} />
              {!user.email && (
                <Modal
                    className="modal"
                    id="modalAuth"
                    ariaHideApp={false}
                    overlayClassName="modal__overlay"
                    isOpen={isAuthPopupVisible}
                    onRequestClose={() => showAuthPopup(false)}
                  >
                  <button className="modal__close" onClick={() => showAuthPopup(false)}></button>
                  <Auth user={user} setUserData={setUserData}/>
                </Modal>
              )}
            </>
          )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
      <YandexMap points={filteredPoints} mapData={mapData} step={step} setMapInstance={setMapInstance} />
    </div>
    </>
  )
}

export default App;

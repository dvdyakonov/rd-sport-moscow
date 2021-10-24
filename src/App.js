import React, { useState, useEffect } from 'react';
import firebase from "firebase/compat/app";
import Modal from 'react-modal';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { firebaseConfig } from 'config/app.json';
import './App.scss';

// Components
import Header from "components/Header";
import Auth from "./components/Auth";
import Loader from 'components/Loader';

// Pages
import Home from "containers/Home";
import TrackActivity from 'containers/TrackActivity';

import "firebase/compat/analytics";
import "firebase/compat/database";
import "firebase/compat/auth";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const App = () => {
  const [user, setUserData] = useState({});
  const [isAuthPopupVisible, showAuthPopup] = useState(false);

  useEffect(() => {
    // Проверяем авторизован ли пользователь
    firebase.auth().onAuthStateChanged(userAuth => {
      if (userAuth) {
        const providerData = userAuth.providerData[0];
        setUserData({
          uid: userAuth.uid,
          email: userAuth.email,
          photo: providerData ? providerData.photoURL : null,
        });
      } else {
        firebase.auth().signInAnonymously();
      }
    });

  }, []);

  return (
    <React.StrictMode>
      <div className="app">
        <Router >
          {user.uid ? (
            <>
              <Header user={user} showAuthPopup={showAuthPopup}/>
              <Route path="/" exact >
                <Home />
              </Route>
              <Route path="/points/:id" exact>
                <TrackActivity user={user} showAuthPopup={showAuthPopup} />
              </Route>
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
          ) : (
            <Loader />
          )}
        </Router>
      </div>
    </React.StrictMode>
  )
}

export default App;

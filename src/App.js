import React, { useState, useEffect } from 'react';
import firebase from "firebase/compat/app";
// import Modal from 'react-modal';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { firebaseConfig } from 'config/app.json';
import './App.scss';

// Components
import Header from "components/Header";

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

  useEffect(() => {
    // Проверяем авторизован ли пользователь
    firebase.auth().onAuthStateChanged(userAuth => {
      if (userAuth) {
        setUserData({
          uid: userAuth.uid,
          email: userAuth.email,
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
          <Header />
          <Route path="/" exact >
            <Home />
          </Route>
          <Route path="/points/:id" exact>
            <TrackActivity user={user} />
          </Route>
        </Router>
      </div>
    </React.StrictMode>
  )
}

export default App;

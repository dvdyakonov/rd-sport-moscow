import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import cx from 'classnames';
import Modal from 'react-modal';
import firebase from "firebase/compat/app";

import {ReactComponent as BellIcon} from './bell.svg';

import Button from '../Button';
import Share from "../Share";
import './Results.scss';

import "firebase/compat/analytics";
import "firebase/compat/database";

const num2str = (n) => {
  const textForms = ['случай', 'случая', 'случаев'];
  n = Math.abs(n) % 100; var n1 = n % 10;
  if (n > 10 && n < 20) { return textForms[2]; }
  if (n1 > 1 && n1 < 5) { return textForms[1]; }
  if (n1 === 1) { return textForms[0]; }
  return textForms[2];
}

const Results = ({ points, data, user, setStep, showAuthPopup, isResultsHidden }) => {
  const history = useHistory();
  const [isSharePopupVisible, showSharePopup] = useState(false);
  const [isRequestSent, changeRequestStatus] = useState(false);
  const [prevEmail, setPrevEmail] = useState(user.email);

  useEffect(() => {
    firebase.database().ref(`users/${user.uid}`).update({ coords: data.coords, name: data.name });
    firebase.analytics().logEvent('search_success', {
      result: points.length || null,
    });
  }, []);

  useEffect(() => {
    if (prevEmail !== user.email) {
      setPrevEmail(user.email, sendRequest());
    }
  }, [user.email])

  const request = {
    coords: data.coords,
    name: data.name,
    // Если есть результаты, то указываем в запросе радиус 0 (случаи заражения в вашем доме)
    distance: points.length === 0 ? data.distance : 0,
  };

  const yourPoints = points.filter(item => item.distance === 0);

  const sendRequest = () => {
    firebase.analytics().logEvent('notifications_subscribe');
    if (!user.email) {
      showAuthPopup(true);
    } else {
      firebase.database().ref('users/' + user.uid + '/requests/').push(request);
      changeRequestStatus(true);
    }
  }

  // Повторный поиск
  const searchAgain = () => {
    firebase.analytics().logEvent('other_address');
    history.push('/');
    setStep(0);
  }

  return (
    <>
      <div className={cx('results', { [`results--hidden`]: isResultsHidden })}>
        <Helmet>
          <title>{`Рядом с вами ${points.length} спортивных площадки – ${data.name}`}</title>
        </Helmet>
        <div className="panel panel--results">
          <p className="address">Ваш адрес: <span>{data.name}</span></p>
          {points.length > 0 ? (
            <div className="text">
              <p>Мы нашли <span>{`${points.length}`}</span> спортивных объекта в радиусе <span>{data.distance} км</span> от ваc.</p>
            </div>
          ) : (
            <div className="text">Мы не нашли спортивных объектов в радиусе <span>{data.distance} км</span> от ваc. Попробуйте увеличить радиус или сменить адрес</div>
          )}
        </div>
        <div className="panel panel--subscribe">
          <BellIcon className="panel__icon"/>
          <p className="message">Хотите узнать о появлении новых спортивных объектов в городе?</p>
          {isRequestSent ? (
            <p className="message message--success">Мы отправим вам уведомление!</p>
          ) : (
            <Button size="l" kind="subscribe" onClick={() => sendRequest()}>Подписаться на уведомления</Button>
          )}
        </div>
        <div className="panel panel--buttons">
          <Button size="s" onClick={() => searchAgain()}>Другой адрес</Button>
          <Button size="s" onClick={() => showSharePopup(true)}>Рассказать друзьям</Button>
        </div>
        <p className="source">Источник данных: <a href="https://coronavirus.mash.ru/" target="_blank" rel="noopener noreferrer">https://coronavirus.mash.ru/</a></p>
      </div>
      <Modal
        className="modal"
        ariaHideApp={false}
        overlayClassName="modal__overlay"
        isOpen={isSharePopupVisible}
        onRequestClose={() => showSharePopup(false)}
      >
        <button className="modal__close" onClick={() => showSharePopup(false)}></button>
        <Share data={data} points={points.length} yourPoints={yourPoints.length}/>
      </Modal>
    </>
  )
}

export default Results;

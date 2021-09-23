import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import { Helmet } from "react-helmet";
import qs from "qs";
import Button from '../Button';
import {ReactComponent as SearchIcon} from './search.svg';

// Подлючаем аналитику
import "firebase/compat/analytics";

import './SearchForm.scss';

const MoscowArea = [
  [55.25, 37.00],
  [56.00, 38.20]
];

const geocode = (ymaps, address, callback) => {
  ymaps.geocode(address).then(function(res) {
      var obj = res.geoObjects.get(0),
          error, hint;
      if (obj) {
          // Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
          switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
              case 'exact':
                  break;
              case 'number':
              case 'near':
              case 'range':
              case 'street':
                  error = 'no_house';
                  hint = 'Уточните номер дома';
                  break;
              case 'other':
              default:
                  error = 'no_street';
                  hint = 'Уточните название улицы';
          }
      } else {
          error = 'no_address';
          hint = 'Уточните адрес';
      }

      // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
      if (error) {
        firebase.analytics().logEvent('search_fail', {
          error_message: error,
        });
        alert(hint);
      } else {
        callback(obj.geometry.getCoordinates());
      }
  }, function (e) {
      firebase.analytics().logEvent('search_fail', {
        error_message: e,
      });
  })

}

const SearchForm = ({ setMapData, currentMap }) => {
  const history = useHistory();
  const [address, setAddress] = useState("");

  const handleSubmit = (event) => {
      event.preventDefault();

      geocode(currentMap, address.replace(/^\s*(.*)\s*$/, '$1'), (coords) => {
        const mapData = {
          name: address,
          coords: coords,
          zoom: (window.innerWidth < 480) ? 15 : 16,
          distance: 0.5,
        };

        setMapData(mapData);
        history.push({ path: "/", search: qs.stringify(mapData)});

        firebase.analytics().logEvent('search_start');
      })
  }

  useEffect(() => {
    const suggestView = new currentMap.SuggestView("suggest", {
      boundedBy: MoscowArea,
    });
    suggestView.events.add("select", function(e){
      setAddress(e.get('item').value)
    })
  }, [currentMap.SuggestView]);

  return (
    <>
      <Helmet>
        <title>QRNTN – Узнай о случаях заражения коронавирусом рядом</title>
      </Helmet>
      <div className="search-form">
        <p>Введите адрес, чтобы узнать о случаях заражения коронавирусом рядом.</p>
        <form className="form form--search" onSubmit={handleSubmit}>
          <div className="input">
            <SearchIcon className="input__icon"/>
            <input type="text" name="address" className="input__element" id="suggest" placeholder="Введите свой адрес" value={address} required onChange={e => setAddress(e.target.value)}/>
          </div>
          <Button kind="check" type="submit" size="l">Проверить</Button>
        </form>
      </div>
    </>
  )
}

export default SearchForm;

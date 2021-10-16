import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPoints,
} from '../../services/points/pointsSlice';
import { YMaps, Map, Placemark, Clusterer, ObjectManager, Circle, ZoomControl } from 'react-yandex-maps';
import { attachYandexHeatmap } from 'utils';
import config from 'config/app.json';
import './YandexMap.scss';

const YandexMap = ({ setMapInstance, mapData }) => {
  let points = useSelector(selectPoints);
  // points = points.slice(0, 100);
  const { yandexMapConfig: { apikey } } = config;
  const map = useRef(null);

  const features = {
    "type": "FeatureCollection",
    "features": points.map(point => (
      {"type": "Feature", "id": point.id, "geometry": {"type": "Point", "coordinates": point.coords}, "properties": {"balloonContentHeader": "<font size=3><b><a target='_blank' href='https://yandex.ru'>Здесь может быть ваша ссылка</a></b></font>", "balloonContentBody": "<p>Ваше имя: <input name='login'></p><p><em>Телефон в формате 2xxx-xxx:</em>  <input></p><p><input type='submit' value='Отправить'></p>", "balloonContentFooter": "<font size=1>Информация предоставлена: </font> <strong>этим балуном</strong>", "clusterCaption": "<strong><s>Еще</s> одна</strong> метка", "hintContent": "<strong>Текст  <s>подсказки</s></strong>"}}
    ))
  }

  return (
    <YMaps query={{
          apikey,
        }}
      >
      <Map className="map" instanceRef={map} state={{ center: mapData.coords, zoom: mapData.zoom }} onLoad={ymaps => {
        ymaps.modules.require('Heatmap');
        setMapInstance(ymaps);
        attachYandexHeatmap(ymaps);
        console.log(ymaps);
      }} modules={["SuggestView", "geocode", "suggest"]}>
        <>
          {/* <Clusterer
            options={{
              preset: 'islands#invertedRedClusterIcons',
              groupByCoordinates: false,
            }}
          >
              {points.map((item, index) => (
                <Placemark key={`place_${index}`} geometry={item.coords} properties={{hintContent: item.title}} modules={['geoObject.addon.hint']} />
              ))}
          </Clusterer> */}

          <ObjectManager
            options={{
              clusterize: true,
              gridSize: 64,
            }}
            objects={{
              openBalloonOnClick: true,
              preset: 'islands#greenDotIcon',
            }}
            clusters={{
              preset: 'islands#redClusterIcons',
            }}
            filter={object => object.id % 2 === 0}
            features={features}
            modules={[
              'objectManager.addon.objectsBalloon',
              'objectManager.addon.objectsHint',
            ]}
          />

          <Placemark geometry={mapData.coords} options={{preset: 'islands#blueDotIcon', iconColor: '#1d98ff'}} properties={{hintContent: mapData.name}} modules={['geoObject.addon.hint']}/>
          <Circle
           geometry={[mapData.coords, mapData.distance * 1000]}
           options={{
             fillColor: '#1d98ff30',
             strokeColor: '#1d98ff',
             strokeOpacity: 0.3,
             strokeWidth: 0,
           }}
          />
        </>
        <ZoomControl options={{
            position: {
              right: 15,
              bottom: 100,
            },
            size: 'small',
          }} />
      </Map>

    </YMaps>
  )
}

export default YandexMap;

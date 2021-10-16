import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectPoints,
} from '../../services/points/pointsSlice';
import { YMaps, Map, Placemark, Clusterer, Circle, ZoomControl } from 'react-yandex-maps';
import config from '../../config/app.json';
import './YandexMap.scss';

const YandexMap = ({ setMapInstance, mapData }) => {
  let points = useSelector(selectPoints);
  points = points.slice(0, 100);
  const { yandexMapConfig: { apikey } } = config;

  return (
    <YMaps query={{
          apikey,
        }}
      >
      <Map className="map" state={{ center: mapData.coords, zoom: mapData.zoom }} onLoad={ymaps => setMapInstance(ymaps)} modules={["SuggestView", "geocode", "suggest"]}>
        <>
          <Clusterer
            options={{
              preset: 'islands#invertedRedClusterIcons',
              groupByCoordinates: false,
            }}
          >
              {points.map((item, index) => (
                <Placemark key={`place_${index}`} geometry={item.coords} properties={{hintContent: item.title}} options={{
                    iconLayout: 'default#image',
                    iconImageHref: 'coronavirus.png',
                    iconImageSize: [40, 40],
                    iconImageOffset:[-20,-20]
                  }} modules={['geoObject.addon.hint']} />
              ))}
          </Clusterer>
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

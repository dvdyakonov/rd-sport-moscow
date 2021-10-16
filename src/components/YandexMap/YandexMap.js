import React, { useRef } from 'react';
import { YMaps, Map, Placemark, Clusterer, Circle, ZoomControl } from 'react-yandex-maps';
import { attachYandexHeatmap } from 'utils';
import config from 'config/app.json';
import './YandexMap.scss';

const YandexMap = ({ setMapInstance, points, mapData }) => {
  const { yandexMapConfig: { apikey } } = config;
  const map = useRef(null);

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
          <Clusterer
            options={{
              preset: 'islands#invertedRedClusterIcons',
              groupByCoordinates: false,
            }}
          >
              {points.map((item, index) => (
                <Placemark key={`place_${index}`} geometry={item.coords} properties={{hintContent: item.title}} modules={['geoObject.addon.hint']} />
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

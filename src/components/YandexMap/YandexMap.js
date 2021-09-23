import React from 'react';
import { YMaps, Map, Placemark, Clusterer, Circle, ZoomControl } from 'react-yandex-maps';
import './YandexMap.scss';

const YandexMap = ({ setMapInstance, points, mapData, step }) => {

  return (
    <YMaps query={{
          apikey: "2fa54cfd-7441-4248-a25c-bb630aec22ff"
        }}
      >
      <Map className="map" state={{ center: mapData.coords, zoom: mapData.zoom }} onLoad={ymaps => setMapInstance(ymaps)} modules={["SuggestView", "geocode", "suggest"]}>
        {step === 1 && (
          <>
            <Clusterer
              options={{
                preset: 'islands#invertedRedClusterIcons',
                groupByCoordinates: false,
              }}
            >
                {points.map((item, index) => (
                  <Placemark key={`place_${index}`} geometry={item.coords} properties={{hintContent: item.name}} options={{
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
        )}
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

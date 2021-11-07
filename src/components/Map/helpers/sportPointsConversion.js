import { uniq } from 'lodash';
import kindsOfSports from 'config/kindsOfSports.json';
import departments from 'config/departments.json';
import typesOfAreas from 'config/typesOfAreas.json';

const sportPointsConversion = (points) => ({
  "type": "FeatureCollection",
  "features": points.map(point => (
    {
      "type": "Feature",
      "id": point.value,
      "geometry": {
        "type": "Point",
        "coordinates": point.coords
      },
      "properties": {
        "balloonContentHeader": `<b style="margin-bottom: 12px;">${point.label}</b>`,
        "balloonContentBody": `
          <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Ведомство:</b> ${departments.find(item => item.value === point.departmentId).label}</p>
          <table style="width: 100%; margin-bottom: 12px;">
            <tr><th><b style="font-weight: bold;">Наименование спортзоны</b></th><th style="text-align: right;"><b style="font-weight: bold;">Площадь</b></th></th>
            ${point.areasItems.map((item) => `<tr><td>${item.label}</td><td style="text-align: right;">${item.square} м2</td></tr>`).join('')}
          </table>
          <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Типы спортивных зон:</b> ${uniq(point.areasItems.map((item) => (typesOfAreas.find(type => type.value === item.typeId).label))).join(', ')}</p>
          <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Виды спорта на объекте:</b> ${uniq(point.areasItems.reduce((res, cur) => {
              cur.kindIds.forEach((item) => {
                const obj = kindsOfSports.find(kind => kind.value === item);
                obj && res.push(obj.label);
              });
              return res;
            }, [])).join(', ')}</p>
            <p style="margin-bottom: 12px;"><b style="font-weight: bold;">Доступность: ${point.radius} м. </b></p>
            <p><button id="balloon-btn-${point.value}" style="font-size: 14px; line-height: 16px;
            background-color: #fff; padding: 6px 12px; color: #cc2223; font-family: 'Proxima Nova'; box-shadow: none; border: 1px solid #cc2223; border-radius: 4px; cursor: pointer;">построить окружность</button></p>
        `,
        "balloonContentFooter": `<p><b style="font-weight: bold;">Адрес:</b> ${point.address}</p>`,
        "clusterCaption": `<strong>${point.label}</strong>`,
        "radius": point.radius,
        "areas": point.areasItems.length,
        "kindOfSports": point.areasItems.reduce((res, cur) => {
          cur.kindIds.forEach((item) => {
            res.push({id: item, square: cur.square})
          })
          return res;
        }, []),
        "square": point.areasItems.reduce((res, cur) => {
          res += cur.square;
          return res;
        }, 0)
      }
    }
  ))
});

export default sportPointsConversion;

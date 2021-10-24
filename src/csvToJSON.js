let csvToJson = require('convert-csv-to-json');
let fs = require('fs');
let _ = require('lodash');

let fileInputName = 'src/config/csv/objects-by-types.csv';

let json = csvToJson.getJsonFromCsv(fileInputName);

const areas = [];
const objects = [];
const departments = [];
const typesOfAreas = [];
const kindsOfSports = [];
const zones = {
  'Шаговая доступность': 500,
  'Районное': 1000,
  'Окружное': 3000,
  'Городское': 5000
}

for (let i = 0; i < json.length; i++) {

  // Формируем JSON видов спорта

  const kindsOfSportsItem = _.find(kindsOfSports, ['label', json[i]['Видспорта']]);

  if (typeof kindsOfSportsItem === 'undefined') {
    kindsOfSports.push({
      value: kindsOfSports.length + 1,
      label: json[i]['Видспорта']
    })
  }

  // Формируем JSON типа спортивных объектов
  const typesOfAreasItem = _.find(typesOfAreas, ['label', json[i]['Типспортзоны']]);

  if (typeof typesOfAreasItem === 'undefined') {
    typesOfAreas.push({
      value: typesOfAreas.length + 1,
      label: json[i]['Типспортзоны']
    })
  }

  // Формируем JSON спортивных зон

  const areasItem = _.find(areas, ['value', Number(json[i]['idСпортзоны'])]);
  const kindsOfSportsItemId = kindsOfSportsItem !== undefined ? kindsOfSportsItem.value : kindsOfSports.length;
  const typesOfAreasItemId = typesOfAreasItem !== undefined ? typesOfAreasItem.value : typesOfAreas.length;

  if (typeof areasItem !== 'undefined') {
    if (areasItem.kindIds.indexOf(kindsOfSportsItemId) === -1) {
      areasItem.kindIds = [...areasItem.kindIds, kindsOfSportsItemId]
    }
  } else {
    areas.push({
      value: Number(json[i]['idСпортзоны']),
      label: json[i]['Спортзона'],
      objectId: Number(json[i]['idОбъекта']),
      typeId: typesOfAreasItemId,
      kindIds: [kindsOfSportsItemId],
      square: Number(json[i]['Площадьспортзоны']),
    })
  }

  // Формируем JSON спортивных объектов

  const objectsItem = _.find(objects, ['value', Number(json[i]['idОбъекта'])]);

  if (typeof objectsItem !== 'undefined') {
    if (objectsItem.areasIds.indexOf(Number(json[i]['idСпортзоны'])) === -1) {
      objectsItem.areasIds = [...objectsItem.areasIds, Number(json[i]['idСпортзоны'])]
      objectsItem.areasItems = [...objectsItem.areasItems, areas[areas.length - 1]]
    }
  } else {
    objects.push({
      value: Number(json[i]['idОбъекта']),
      label: json[i]['Спортзона'],
      departmentId: Number(json[i]['idВедомственнойОрганизации']),
      coords: [json[i]['Широта(Latitude)'], json[i]['Долгота(Longitude)']],
      address: json[i]['Адрес'],
      areasIds: [Number(json[i]['idСпортзоны'])],
      areasItems: [areas[areas.length - 1]],
      radius: Number(zones[json[i]['Доступность']]),
    })
  }

  // Формируем JSON организаций


  const departmentsItem = _.find(departments, ['value', Number(json[i]['idВедомственнойОрганизации'])]);

  if (typeof departmentsItem !== 'undefined') {
    if (departmentsItem.objectIds.indexOf(Number(json[i]['idОбъекта'])) === -1) {
      departmentsItem.objectIds = [...departmentsItem.objectIds, Number(json[i]['idОбъекта'])]
    }
  } else {
    departments.push({
      value: Number(json[i]['idВедомственнойОрганизации']),
      label: json[i]['ВедомственнаяОрганизация'],
      objectIds: [Number(json[i]['idОбъекта'])]
    })
  }

}

fs.writeFile('src/config/kindsOfSports.json', JSON.stringify(kindsOfSports, null, 4), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to kindsOfSports.json");
    }
});

fs.writeFile('src/config/typesOfAreas.json', JSON.stringify(typesOfAreas, null, 4), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to typesOfAreas.json");
    }
});

fs.writeFile('src/config/areas.json', JSON.stringify(areas, null, 4), (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log("JSON saved to areas.json");
  }
});

fs.writeFile('src/config/objects.json', JSON.stringify(objects, null, 4), (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log("JSON saved to objects.json");
  }
});

fs.writeFile('src/config/departments.json', JSON.stringify(departments, null, 4), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to departments.json");
    }
});

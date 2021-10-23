let csvToJson = require('convert-csv-to-json');
let fs = require('fs');
let _ = require('lodash');

let fileInputName = 'src/config/csv/objects-by-types.csv';

// csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);

let json = csvToJson.getJsonFromCsv(fileInputName);

const points = [];
const types = [];
const organizations = [];
const objects = [];

for (let i = 0; i < json.length; i++) {

    // JSON со списком видов спорта

    if (!_.find(types, ['title', json[i]['Видспорта']])) {
        types.push({
            value: 'x' + i,
            label: json[i]['Видспорта']
        })

    }

    // JSON со списком объектов

    if (!_.find(objects, ['id', json[i]['idОбъекта']])) {
      objects.push({
          value: json[i]['idОбъекта'],
          label: json[i]['Объект']
      })
  }

    // JSON со списком организаций

    if (!_.find(organizations, ['id', json[i]['idВедомственнойОрганизации']])) {
        organizations.push({
            value: json[i]['idВедомственнойОрганизации'],
            label: json[i]['ВедомственнаяОрганизация']
        })
    }

    // JSON со списком спортзон + группируем

    let point = _.find(points, ['id', json[i]['idСпортзоны']]);
    let pointType = _.find(types, ['title', json[i]['Видспорта']]);

    if (point) {
        point.types = [...point.types, pointType.id];
    } else {
        points.push({
            id: json[i]['idСпортзоны'],
            address: json[i]['Адрес'],
            title: json[i]['Спортзона'],
            coords: [json[i]['Широта(Latitude)'], json[i]['Долгота(Longitude)']],
            square: json[i]['Площадьспортзоны'],
            types: [pointType.id],
            parent: json[i]['idОбъекта']
        })
    }

}

fs.writeFile('src/config/types.json', JSON.stringify(types, null, 4), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to types.json");
    }
});

fs.writeFile('src/config/organizations.json', JSON.stringify(organizations, null, 4), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to organizations.json");
    }
});

fs.writeFile('src/config/objects.json', JSON.stringify(objects, null, 4), (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log("JSON saved to objects.json");
  }
});

fs.writeFile('src/config/points.json', JSON.stringify(points, null, 4), (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to points.json");
    }
});

export const prepareCSVName = `mossport-report.csv`;

export function prepareCSV (stats) {
  const data = [];
  const tableHeading = [
    'ID',
    'Площадь области',
    'Численность населения',
    'Плотность населения на 1 км²',
    'Количество спортивных зон',
    'Количество спортивных зон на 1 человека',
    'Площадь спортивных зон',
    'Площадь спортивных зон на 1 человека',
  ];

  data.push(tableHeading);

  stats.map((item) => {
    const row = [];
    row.push(
      item.id,
      item.square,
      item.population,
      item.populationDensity,
      item.areas,
      item.areasPerHuman,
      item.areasSquare,
      item.areasSquarePerHuman,
    );
    return data.push(row);
  });

  return data;
};

export function exportToCsv (filename, rows) {
  const processRow = (row) => {
    let finalVal = '';
    for (let j = 0; j < row.length; j += 1) {
      let innerValue = row[j] === null ? '' : row[j];
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue;
      if (j > 0) finalVal += ';';
      finalVal += `"${result}"`;
    }
    return `${finalVal}\n`;
  };

  let csvFile = '';
  for (let i = 0; i < rows.length; i += 1) {
    csvFile += processRow(rows[i]);
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export default { exportToCsv, prepareCSVName, prepareCSV };

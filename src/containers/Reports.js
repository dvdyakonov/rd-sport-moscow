import React, {useMemo, useState} from 'react';
import {useHistory} from "react-router-dom";
import { useTable, useSortBy } from 'react-table'
import Button from 'components/Button';
import DashboardFilter from 'components/Dashboard/DashboardFilters';
import {exportToCsv, prepareCSVName, prepareCSV} from 'utils/csv';

import './Reports.scss';


const Reports = () => {
  const history = useHistory();
  const goToPolygon = (id) => history.push(`/polygons/${id}`);
  const dataConverter = (array) => {
    return array.map(item => {
      const polygonSquare = ((item.data.polygonSquare / 1e6).toFixed(3));
      return {
        id: item.idx,
        square: `${polygonSquare} км²`,
        population: item.data.population,
        populationDensity: (item.data.population / polygonSquare).toFixed(3),
        areas: item.data.areas,
        areasPerHuman: (
          item.data.population
          ? (item.data.areas / item.data.population)
          : 0).toFixed(3),
        areasSquare: (item.data.square).toFixed(3),
        areasSquarePerHuman: (
          item.data.population
          ? (item.data.square / item.data.population)
          : 0).toFixed(3),
        actions: <Button className="reports__table-btn" size="s" kind="primary" onClick={() => goToPolygon(item.idx)}>Инфо</Button>
      }
    })
  }

  const [polygonsData, setPolygonsData] = useState(() => {
    const polygons = window.localStorage.getItem('userPolygons') ? JSON.parse(window.localStorage.getItem('userPolygons')) : [];
    return dataConverter(polygons);
  });

  const saveFile = () => exportToCsv(prepareCSVName, prepareCSV(polygonsData));

  const data = useMemo(() => [...polygonsData], []);

  const columns = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id'
    }, {
      Header: 'Площадь',
      accessor: 'square'
    }, {
      Header: 'Население',
      accessor: 'population'
    }, {
      Header: 'Плотность населения на 1 км²',
      accessor: 'populationDensity'
    }, {
      Header: 'Кол-во спортзон',
      accessor: 'areas'
    }, {
      Header: 'Кол-во спортзон на 1 чел.',
      accessor: 'areasPerHuman'
    }, {
      Header: 'Площадь спортзон (м²)',
      accessor: 'areasSquare'
    }, {
      Header: 'Площадь спортзон на 1 чел. (м²)',
      accessor: 'areasSquarePerHuman'
    }, {
      Header: 'Действия',
      accessor: 'actions'
    }
  ], []);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data}, useSortBy);

  return (<main className="main">
    <div className="reports">
      <div className="reports__container">
        <div className="reports__heading">
          <div className="reports__title">Отчеты</div>
          <Button className="reports__heading-action" onClick={saveFile}>Экспорт</Button>
        </div>
        <div className="reports__subtitle">Ниже представлен список сохраненных полигонов с информацией о спортивных зонах на его территории</div>

        <div className="reports__filters">
          <div className="reports__filters-title">Фильтры</div>
          <DashboardFilter/>
        </div>

        <div className="reports__table-wrapper">
          <table {...getTableProps()} className="reports__table">
            <thead>
              {
                headerGroups.map(headerGroup => (<tr {...headerGroup.getHeaderGroupProps()} className="reports__table-head-tr">
                  {
                    headerGroup.headers.map(column => (<th {...column.getHeaderProps(column.getSortByToggleProps())} className="reports__table-head-th">
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>))
                  }
                </tr>))
              }
            </thead>
            <tbody {...getTableBodyProps()}>
              {
                rows.map(row => {
                  prepareRow(row)
                  return (<tr {...row.getRowProps()} className="reports__table-body-th">
                    {
                      row.cells.map(cell => {
                        return (<td {...cell.getCellProps()} className="reports__table-body-td">
                          {cell.render('Cell')}
                        </td>)
                      })
                    }
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>)
}

export default Reports;

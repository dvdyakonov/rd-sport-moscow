import React, {useMemo, useState} from 'react';
import {useHistory} from "react-router-dom";
import { useTable, useSortBy } from 'react-table';
import { useSelector } from 'react-redux';
import {
  selectShowReports,
  selectPolygons,
} from 'services/points/pointsSlice';
import Button from 'components/Button';
// import DashboardFilter from 'components/Dashboard/DashboardFilters';
import {exportToCsv, prepareCSVName, prepareCSV} from 'utils/csv';

import './Reports.scss';

const Reports = () => {
  const polygonList = useSelector(selectPolygons);
  const history = useHistory();
  const showReports = useSelector(selectShowReports);
  const goToPolygon = (id) => history.push(`/polygons/${id}`);
  const dataConverter = (array) => {
    return array.map(item => {
      const polygonSquare = ((item.square / 1e6).toFixed(3));
      return {
        id: item.idx,
        square: `${polygonSquare} км²`,
        population: item.population,
        populationDensity: (item.population / polygonSquare).toFixed(3),
        areas: item.sportObjects.areas,
        areasPerHuman: (
          item.population
          ? (item.sportObjects.areas / item.population)
          : 0).toFixed(3),
        areasSquare: (item.sportObjects.square).toFixed(3),
        areasSquarePerHuman: (
          item.population
          ? (item.sportObjects.square / item.population)
          : 0).toFixed(3),
        actions: <Button className="reports__table-btn" size="s" kind="primary" onClick={() => goToPolygon(item.idx)}>Инфо</Button>
      }
    })
  }

  const saveFile = () => exportToCsv(prepareCSVName, prepareCSV(dataConverter(polygonList)));
  const data = useMemo(() => [...dataConverter(polygonList)], [polygonList]);

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

  return (<div className={`reports ${showReports ? 'reports--visible' : ''}`}>
    <div className="reports__container">
      <div className="reports__heading">
        <div className="reports__title">Отчеты</div>
        <Button className="reports__heading-action" onClick={saveFile}>Экспорт</Button>
      </div>
      <div className="reports__subtitle">Ниже представлен список сохраненных полигонов с информацией о спортивных зонах на его территории</div>

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
  </div>)
}

export default Reports;

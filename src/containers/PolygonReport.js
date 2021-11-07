import React, {useMemo, useState} from 'react';
import { useParams } from "react-router-dom";
import { useTable, useSortBy } from 'react-table';
import MapPreview from 'components/MapPreview';
import kindsOfSports from 'config/kindsOfSports.json';

const PolygonReport = () => {
  const { id: polygonId } = useParams();
  const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
  const currentPolygon = userPolygons.find(item => Number(item.idx) === Number(polygonId));

  const dataConverter = (object) => {
    const keys = Object.keys(object);
    return keys.map(id => {
      const obj = kindsOfSports.find(kind => kind.value === Number(id)); 
      return {
        label: obj.label,
        areas: object[id].count,
        areasPerHuman: (currentPolygon.population
          ? (object[id].count / currentPolygon.population)
          : 0).toFixed(3),
          areasSquare: (object[id].square).toFixed(3),
          areasSquarePerHuman: (
            currentPolygon.population
            ? (object[id].square / currentPolygon.population)
            : 0).toFixed(3),
      }
    })
  }

  const data = useMemo(() => [...dataConverter(currentPolygon.sportObjects.kindIds)], [currentPolygon.sportObjects.kindIds]);

  const columns = useMemo(() => [
    {
      Header: 'Вид спорта',
      accessor: 'label',
      align: 'left',
    }, {
      Header: 'Кол-во спортзон',
      accessor: 'areas'
    }, {
      Header: 'Кол-во спортзон на 1 чел.',
      accessor: 'areasPerHuman'
    }, {
      Header: 'Площадь спортзон (м²)',
      accessor: 'areasSquare',
    }, {
      Header: 'Площадь спортзон на 1 чел. (м²)',
      accessor: 'areasSquarePerHuman',
      isSortedDesc: true,
      isSortedDesc: true,
    }, 
  ], []);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data}, useSortBy);

  return (
    <main className="main">
      <div className="page page--report" style={{"padding": "20px"}}>
        <MapPreview polygonData={currentPolygon} />
        <h1>Отчет по полигону: {currentPolygon.idx}</h1>

        <p>Площадь полигона: {(currentPolygon.square).toFixed(3)} м²</p>
        <p>Население: {currentPolygon.population} чел.</p>
        <p>Плотность населения: {(currentPolygon.population / currentPolygon.square).toFixed(3)}</p>
        <p>Кол-во спортивных объектов: {currentPolygon.sportObjects.areas}</p>
        <p>Кол-во спортивных объектов на 1 чел: {(currentPolygon.population ? (currentPolygon.sportObjects.areas / currentPolygon.population): 0).toFixed(3)} м²</p>
        <p>Площадь спортивных объектов: {(currentPolygon.sportObjects.square).toFixed(3)}</p>
        <p>Площадь спортивных объектов на 1 чел: {(currentPolygon.population ? (currentPolygon.sportObjects.square / currentPolygon.population): 0).toFixed(3)} м²</p>

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
    </main>
  )
}

export default PolygonReport;

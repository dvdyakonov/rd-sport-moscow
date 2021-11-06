import React, { useMemo } from 'react';
import { useHistory } from "react-router-dom";
import { useTable } from 'react-table'
import Button from 'components/Button';
import { exportToCsv, prepareCSVName, prepareCSV } from 'utils/csv';

import './Reports.scss';

const Reports = () => {
  const saveFile = () => {
    console.log(prepareCSVName);
  };

  const history = useHistory();

  const goToPolygon = (id) => history.push(`/polygon/${id}`);

  const data = useMemo(
   () => [
     {
       col1: '#0',
       col2: 'World',
       col3: 'World',
       col10: <Button className="reports__table-btn" size="s" kind="primary" onClick={() => goToPolygon(0)}>Инфо</Button>
     },
     {
       col1: '#1',
       col2: 'World',
       col3: 'World',
       col10: <Button className="reports__table-btn" size="s" kind="primary" onClick={() => goToPolygon(1)}>Инфо</Button>
     },
     {
       col1: '#2',
       col2: 'World',
       col3: 'World',
       col10: <Button className="reports__table-btn" size="s" kind="primary" onClick={() => goToPolygon(2)}>Инфо</Button>
     },
   ],
   []
 )

 const columns = useMemo(
   () => [
     {
       Header: 'ID',
       accessor: 'col1',
     },
     {
       Header: 'Площадь',
       accessor: 'col2',
     },
     {
       Header: 'Население',
       accessor: 'col3',
     },
     {
       Header: 'Плотность населения на 1 км²',
       accessor: 'col4',
     },
     {
       Header: 'Кол-во спортзон',
       accessor: 'col5',
     },
     {
       Header: 'Кол-во спортзон на 1 человека',
       accessor: 'col6',
     },
     {
       Header: 'Виды спорта',
       accessor: 'col7',
     },
     {
       Header: 'Площадь спортзон',
       accessor: 'col8',
     },
     {
       Header: 'Площадь спортзон на 1 человека',
       accessor: 'col9',
     },
     {
       Header: 'Действия',
       accessor: 'col10',
     }
   ],
   []
 );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <main className="main">
      <div className="reports">
        <div className="reports__container">
          <div className="reports__heading">
            <div className="reports__title">Отчеты</div>
            <Button className="reports__heading-action" onClick={saveFile}>Экспорт</Button>
          </div>
          <div className="reports__subtitle">Ниже представлен список сохраненных полигонов с информацией о спортивных зонах на его территории</div>

          <div className="reports__table-wrapper">
            <table {...getTableProps()} className="reports__table">
             <thead>
               {headerGroups.map(headerGroup => (
                 <tr {...headerGroup.getHeaderGroupProps()} className="reports__table-head-tr">
                   {headerGroup.headers.map(column => (
                     <th
                       {...column.getHeaderProps()}
                       className="reports__table-head-th"
                     >
                       {column.render('Header')}
                     </th>
                   ))}
                 </tr>
               ))}
             </thead>
             <tbody {...getTableBodyProps()}>
               {rows.map(row => {
                 prepareRow(row)
                 return (
                   <tr {...row.getRowProps()} className="reports__table-body-th">
                     {row.cells.map(cell => {
                       return (
                         <td
                           {...cell.getCellProps()}
                            className="reports__table-body-td"
                         >
                           {cell.render('Cell')}
                         </td>
                       )
                     })}
                   </tr>
                 )
               })}
             </tbody>
           </table>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Reports;

import React, { useMemo } from 'react';
import { useTable } from 'react-table'
import Button from 'components/Button';
import { exportToCsv, prepareCSVName, prepareCSV } from 'utils/csv';

import './Reports.scss';

const Reports = () => {
  const saveFile = () => {
    console.log(prepareCSVName);
  };

  const data = useMemo(
   () => [
     {
       col1: 'Hello',
       col2: 'World',
     },
     {
       col1: 'react-table',
       col2: 'rocks',
     },
     {
       col1: 'whatever',
       col2: 'you want',
     },
   ],
   []
 )

 const columns = useMemo(
   () => [
     {
       Header: 'Площадь области',
       accessor: 'col1',
     },
     {
       Header: 'Численность населения',
       accessor: 'col2',
     },
     {
       Header: 'Плотность населения на 1 км²',
       accessor: 'col3',
     },
     {
       Header: 'Количество спортивных зон',
       accessor: 'col4',
     },
     {
       Header: 'Количество спортивных зон на 1 человека',
       accessor: 'col5',
     },
     {
       Header: 'Виды спорта',
       accessor: 'col6',
     },
     {
       Header: 'Площадь спортивных зон',
       accessor: 'col7',
     },
     {
       Header: 'Площадь спортивных зон на 1 человека',
       accessor: 'col8',
     },
     {
       Header: 'Действия',
       accessor: 'col9',
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
            <Button className="reporst__heading-action" onClick={saveFile}>Экспорт</Button>
          </div>
          <div className="reports__subtitle">Ниже представлен список сохраненных полигонов с информацией о спортивных объектах, попавших в его пределы</div>

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

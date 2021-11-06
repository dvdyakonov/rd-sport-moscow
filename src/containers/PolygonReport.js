import React from 'react';
import { useParams } from "react-router-dom"

const PolygonReport = () => {
  const { id: polygonId } = useParams();
  const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
  const currentPolygon = userPolygons.find(item => Number(item.idx) === Number(polygonId));
  console.log(currentPolygon);
  return (
    <main className="main">
      <p>Тут отчет по точке {currentPolygon.idx}</p>
    </main>
  )
}

export default PolygonReport;

import React from 'react';
import { useParams } from "react-router-dom"
import MapPreview from 'components/MapPreview';

const PolygonReport = () => {
  const { id: polygonId } = useParams();
  const userPolygons = JSON.parse(localStorage.getItem('userPolygons')) || [];
  const currentPolygon = userPolygons.find(item => Number(item.idx) === Number(polygonId));
  return (
    <main className="main">
      <div className="page page--report" style={{"padding": "20px"}}>
        <MapPreview polygonData={currentPolygon} />
        <h1>Отчет по полигону: {currentPolygon.idx}</h1>
      </div>
    </main>
  )
}

export default PolygonReport;

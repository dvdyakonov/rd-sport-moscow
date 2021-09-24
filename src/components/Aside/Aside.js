import React from 'react';
import SearchForm from '../SearchForm';
import './Aside.scss';

const Aside = ({type, setMapData, currentMap, objectType, objectTypeToggle}) => {
  const asideRender = (flag) => {
    switch (flag) {
      case 'point':
        return (
          <SearchForm setMapData={setMapData} currentMap={currentMap} />
        )
      case 'event':
        return (
          <SearchForm setMapData={setMapData} currentMap={currentMap} />
        )
      default:
        return (
          <SearchForm setMapData={setMapData} currentMap={currentMap} />
        )
    }
  }

  return (
    <aside className={`aside aside--${type}`}>
      {asideRender(type)}
      <div className="aside__toggle">
        <input id="toggle" className="aside__toggle-checkbox" type="checkbox" value={objectType === 'points'} onChange={e => e.target.value ? objectTypeToggle('events') : objectTypeToggle('points')}></input>
        <label className="aside__toggle-label" htmlFor="toggle">
          <span className="aside__toggle-label-span">События</span>
        </label>
      </div>
    </aside>
  )
}

export default Aside;

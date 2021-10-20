import React from 'react';
import SearchForm from '../SearchForm';
import './Aside.scss';

const Aside = ({type, status, showEventsToggle}) => {
  const asideRender = (flag) => {
    switch (flag) {
      case 'point':
        return (
          <SearchForm />
        )
      case 'event':
        return (
          <SearchForm />
        )
      default:
        return (
          <SearchForm />
        )
    }
  }

  return (
    <aside className={`aside aside--${type}`}>
      {asideRender(type)}
      <div className="aside__toggle">
        <input id="toggle" className={`aside__toggle-checkbox aside__toggle-checkbox--${status ? 'on' : 'off'}`} type="checkbox" value={!status} onChange={e => showEventsToggle(!status)}></input>
        <label className="aside__toggle-label" htmlFor="toggle">
          <span className="aside__toggle-label-span">События</span>
        </label>
      </div>
    </aside>
  )
}

export default Aside;

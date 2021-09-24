import React, { useState, useEffect } from 'react';
import { Popover } from 'react-tiny-popover';
import types from 'config/types.json';

const FilterSport = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState();
  const [checkedState, setCheckedState] = useState(
    new Array(types.length).fill(true)
  );
  const [total, setTotal] = useState(types.length);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    setTotal(updatedCheckedState.filter(st => st).length);
  };

  const content = () => (
    <div className="filters__item-popover">
      <ul className="filter__sport-list">
      {
        types.map((type, index) => <li className="filter__sport-item" key={type.id}>
          <img src={`/sport-icons/${type.name}.svg`} alt={type.title} className="filter__sport-item-img" width="24" height="24" />
          <label htmlFor={`custom-checkbox-${type.id}`} className="filter__sport-item-title">{type.title}</label>
          <input
            type="checkbox"
            className="filter__sport-item-checkbox"
            id={`custom-checkbox-${type.id}`}
            name={type.name}
            value={type.name}
            checked={checkedState[index]}
            onChange={() => handleOnChange(index)}
          />
        </li>)
      }
      </ul>
    </div>
  )

  return <div className="filters__item filter__sport">
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom']}
      align="end"
      onClickOutside={() => setIsPopoverOpen(false)}
      content={content()}
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="filters__btn">
        Виды спорта <span>({total})</span>
      </div>
    </Popover>
  </div>
}

export default FilterSport;

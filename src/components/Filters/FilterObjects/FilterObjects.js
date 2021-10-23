import React, { useState } from 'react';
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

import objects from 'config/objects.json';

const FilterObjects = () => {
  const { depart } = useSelector(selectFilters);
  const [options, setOptions] = useState(objects.slice(0,100));
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setFilter({
      param: 'depart',
      value: val ? val.value : ''
    }));
  };

  const inputChange = (val) => {
    const temp = objects.filter(item => item.label.indexOf(val) >= 0);
    setOptions(temp.slice(0,100));
  }

  return <div className="filters__item filter__depart">
    <Select
      name="depart"
      isSearchable
      isClearable
      placeholder="Ведомственная принадлежность"
      className="filter__field filter__field--select"
      options={options}
      onInputChange={inputChange}
      onChange={handleOnChange}
      value={objects.filter(el => el.value === depart)[0]}
    />
  </div>
}

export default FilterObjects;

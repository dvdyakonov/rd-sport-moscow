import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

import organizations from 'config/organizations.json';

const FilterAvaliable = () => {
  const { depart } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setFilter({
      param: 'depart',
      value: val ? val.value : null
    }));
  };

  return <div className="filters__item filter__avaliable">
    <Select
      isClearable
      name="avaliable"
      options={organizations}
      placeholder="По ведомствам"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={organizations.filter(el => el.value === depart)[0]}
    />
  </div>
}

export default FilterAvaliable;

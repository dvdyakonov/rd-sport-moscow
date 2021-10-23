import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

const variants = [
  { value: 500, label: 'Шаговая доступность' },
  { value: 1000, label: 'Районная доступность' },
  { value: 3000, label: 'Окружная доступность' },
  { value: 5000, label: 'Городское значение' },
]

const FilterRadius = () => {
  const { avaliable } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setFilter({
      param: 'avaliable',
      value: val ? val.value : null
    }));
  };

  return <div className="filters__item filter__avaliable">
    <Select
      isClearable
      name="avaliable"
      options={variants}
      placeholder="Доступность"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={variants.filter(el => el.value === avaliable)[0]}
    />
  </div>
}

export default FilterRadius;

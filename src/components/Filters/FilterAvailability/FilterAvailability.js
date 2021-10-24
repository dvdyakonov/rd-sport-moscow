import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectAreasFilters, setAreasFilter } from 'services/areas/areasSlice';

const variants = [
  { value: 500, label: 'Шаговая доступность' },
  { value: 1000, label: 'Районная доступность' },
  { value: 3000, label: 'Окружная доступность' },
  { value: 5000, label: 'Городское значение' },
]

const FilterAvailability = () => {
  const { availability } = useSelector(selectAreasFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setAreasFilter({
      param: 'availability',
      value: val ? val.value : null
    }));
  };

  return <div className="filters__item filter__availability">
    <Select
      isClearable
      name="availability"
      options={variants}
      placeholder="Доступность"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={variants.filter(el => el.value === availability)[0]}
    />
  </div>
}

export default FilterAvailability;

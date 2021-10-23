import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

import typesOptions from 'config/kindsOfSports.json';

const FilterSport = () => {
  const { types } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setFilter({
      param: 'types',
      value: val
    }));
  };

  return <div className="filters__item filter__sport">
    <Select
      isMulti
      isSearchable
      isClearable
      name="types"
      options={typesOptions}
      placeholder="Виды спорта"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={types}
    />
  </div>
}

export default FilterSport;

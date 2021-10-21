import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, filterData } from 'services/points/pointsSlice';

import typesOptions from 'config/types.json';

const FilterSport = () => {
  const { types } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(filterData({
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
      placeholder="По виду спорта"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={types}
    />
  </div>
}

export default FilterSport;

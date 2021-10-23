import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

import typesOfAreasOptions from 'config/typesOfAreas.json';

const FilterAreaTypes = () => {
  const { areaType } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setFilter({
      param: 'areaType',
      value: val
    }));
  };

  return <div className="filters__item filter__sport">
    <Select
      isSearchable
      isClearable
      name="types"
      options={typesOfAreasOptions}
      placeholder="Тип спортивных зон"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={areaType}
    />
  </div>
}

export default FilterAreaTypes;

import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

const typesOptions = [
  { value: 'pool', label: 'Бассейн' },
  { value: 'covered', label: 'Крытая спортивная зона' },
  { value: 'open', label: 'Открытая спортивная зона' },
]

const FilterTypeZone = () => {
  const { typeZone } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (val) => {
    dispatch(setFilter({
      param: 'typeZone',
      value: val
    }));
  };

  return <div className="filters__item filter__sport">
    <Select
      isSearchable
      isClearable
      name="types"
      options={typesOptions}
      placeholder="По типу спортивных зон"
      className="filter__field filter__field--select"
      onChange={handleOnChange}
      value={typeZone}
    />
  </div>
}

export default FilterTypeZone;

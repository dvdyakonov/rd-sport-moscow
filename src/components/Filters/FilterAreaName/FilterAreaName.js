import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

const FilterAreaName = () => {
  const { areaName } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (e) => {
    dispatch(setFilter({
      param: 'areaName',
      value: e.target.value
    }));
  };

  return <div className="filters__item filter__date">
    <input
      type="text"
      placeholder="Наименованию спорт зоны"
      className="filter__field filter__field--input"
      onChange={handleOnChange}
      value={areaName}
    />
  </div>
}

export default FilterAreaName;

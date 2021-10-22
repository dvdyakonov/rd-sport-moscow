import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, setFilter } from 'services/points/pointsSlice';

const FilterObjectName = () => {
  const { objectName } = useSelector(selectFilters);
  const dispatch = useDispatch();
  const handleOnChange = (e) => {
    dispatch(setFilter({
      param: 'objectName',
      value: e.target.value
    }));
  };

  return <div className="filters__item filter__date">
    <input
      type="text"
      placeholder="По наименованию"
      className="filter__field filter__field--input"
      onChange={handleOnChange}
      value={objectName}
    />
  </div>
}

export default FilterObjectName;

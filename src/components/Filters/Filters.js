import Button from 'components/Button';
import './Filters.scss';
import FilterAvaliable from './FilterAvaliable';
import FilterSport from './FilterSport';
import FilterObjectName from './FilterObjectName';
import FilterObjects from './FilterObjects';
import FilterTypes from './FilterTypes';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, filterData } from 'services/points/pointsSlice';

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  return <div className="filters">
    <div className="filters__title">Фильтры спортивных объектов:</div>
    <FilterObjectName />
    <FilterSport />
    <FilterAvaliable />
    <FilterTypes />
    <FilterObjects />

    <Button
      kind="wide"
      className="filters__btn"
      onClick={() => dispatch(filterData(filters))}
    >
      Отфильтровать
    </Button>
  </div>
}

export default Filters;

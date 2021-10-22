import Button from 'components/Button';
import './Filters.scss';
import FilterAvaliable from './FilterAvaliable';
import FilterSport from './FilterSport';
import FilterObjectName from './FilterObjectName';
import FilterOrganizations from './FilterOrganizations';
import FilterTypes from './FilterTypes';
import { useDispatch } from 'react-redux';
import { filterData } from 'services/points/pointsSlice';

const Filters = () => {
  const dispatch = useDispatch();
  return <div className="filters">
    <div className="filters__title">Фильтры спортивных объектов:</div>
    <FilterObjectName />
    <FilterSport />
    <FilterAvaliable />
    <FilterTypes />
    <FilterOrganizations />

    <Button
      kind="wide"
      className="filters__btn"
      onClick={() => dispatch(filterData())}
    >
      Отфильтровать
    </Button>
  </div>
}

export default Filters;

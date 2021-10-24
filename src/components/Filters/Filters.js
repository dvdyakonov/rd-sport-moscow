import Button from 'components/Button';
import './Filters.scss';
import FilterRadius from './FilterRadius';
import FilterSport from './FilterSport';
import FilterObjectName from './FilterObjectName';
import FilterAreaName from './FilterAreaName';
import FilterDepartments from './FilterDepartments';
import FilterAreaTypes from './FilterAreaTypes';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, filterData } from 'services/points/pointsSlice';

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  return <div className="filters">
    <div className="filters__title">Фильтры спортивных объектов:</div>
    <FilterObjectName />
    <FilterDepartments />
    <FilterAreaName />
    <FilterAreaTypes />
    <FilterSport />
    <FilterRadius />


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

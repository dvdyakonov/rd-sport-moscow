import Button from 'components/Button';
import './DashboardFilters.scss';
import FilterRadius from 'components/Filters/FilterRadius';
import FilterSport from 'components/Filters/FilterSport';
import FilterObjectName from 'components/Filters/FilterObjectName';
import FilterAreaName from 'components/Filters/FilterAreaName';
import FilterDepartments from 'components/Filters/FilterDepartments';
import FilterAreaTypes from 'components/Filters/FilterAreaTypes';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, filterData } from 'services/points/pointsSlice';

const DashboardFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  return <div className="dashboard-filters">
    <div className="dashboard-filters__item">
      <FilterObjectName />
    </div>
    <div className="dashboard-filters__item">
      <FilterDepartments />
    </div>
    <div className="dashboard-filters__item">
      <FilterAreaName />
    </div>
    <div className="dashboard-filters__item">
      <FilterAreaTypes />
    </div>
    <div className="dashboard-filters__item">
      <FilterSport />
    </div>
    <div className="dashboard-filters__item">
      <FilterRadius />
    </div>
    <div className="dashboard-filters__item">
      <Button
        className="dashboard-filters__btn"
        kind="secondary"
        onClick={() => dispatch(filterData(filters))}
      >
        Отфильтровать
      </Button>
    </div>
  </div>
}

export default DashboardFilters;

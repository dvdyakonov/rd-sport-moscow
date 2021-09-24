import './Filters.scss';
import FilterStatus from './FilterStatus';
import FilterSport from './FilterSport';
import FilterDate from './FilterDate';

const Filters = ({ status }) => {
  // status === true, если показаны события. False - показаны точки
  return <div className="filters">
    <FilterSport />
    {
      status ?
        <FilterDate /> :
        <FilterStatus />
    }
  </div>
}

export default Filters;

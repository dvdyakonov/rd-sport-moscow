import './Filters.scss';
import FilterStatus from './FilterStatus';
import FilterSport from './FilterSport';
import FilterDate from './FilterDate';
import types from 'config/types.json';

const Filters = ({ status }) => {
  // status === true, если показаны события. False - показаны точки
  return <div className="filters">
    <FilterStatus />
    {
      status ?
        <FilterDate /> :
        <FilterSport />
    }
  </div>
}

export default Filters;

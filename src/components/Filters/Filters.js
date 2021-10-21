import './Filters.scss';
import FilterAvaliable from './FilterAvaliable';
import FilterSport from './FilterSport';
import FilterObjectName from './FilterObjectName';

const Filters = () => {
  return <div className="filters">
    <div className="filters__title">Фильтры:</div>
    <FilterObjectName />
    <FilterSport />
    <FilterAvaliable />
  </div>
}

export default Filters;

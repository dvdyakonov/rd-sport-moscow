import { createSlice } from '@reduxjs/toolkit';
import points from 'config/points.json';

const initialState = {
  data: [...points],
  filters: {
    objectName: '',
    depart: '',
    areaName: null,
    areaType: null,
    types: [],
    avaliable: null,
  }
};

export const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { param, value } = action.payload;
      state.filters = {
        ...state.filters,
        [param]: value
      };
    },
    filterData: (state, action) => {
      const filters = action.payload;
      const newArr = points.filter(point => {
        // Проверяем на совпадение по наименованию объекта
        if (filters.objectName) {
          if(point.title.indexOf(filters.objectName) < 0) {
            return false;
          }
        }

        // Проверяем на совпадение по видам спорта
        if (filters.types.length > 0) {
          const typeIds = filters.types.map(type => type.value);
          if(point.types.filter(type => typeIds.indexOf(type) >= 0).length === 0) {
            return false;
          }
        }

        // Проверяем на совпадение ведомственной пренадлежности
        if (filters.depart) {
          if(point.parent !== filters.depart) {
            return false;
          }
        }

        // Проверяем на доступность
        if (filters.avaliable) {
          if(point.radius !== filters.avaliable) {
            return false;
          }
        }

        return true;
      });

      state.data = [...newArr];
    }
  },
});

export const { setFilter, filterData } = pointsSlice.actions;

export const selectFilters = (state) => state.points.filters;
export const selectPoints = (state) => state.points.data;
export const selectActivePoint = (state) => state.points.active;

export default pointsSlice.reducer;

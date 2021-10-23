import { createSlice } from '@reduxjs/toolkit';
import points from 'config/points.json';

const initialState = {
  data: [...points],
  filters: {
    objectName: '',
    depart: null,
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
      const { filters } = action.payload;
      const newArr = points.filter(point => {
        // point.title.indexOf(filters.objectName) >= 0 &&
        // point.types.indexOf(filters)
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

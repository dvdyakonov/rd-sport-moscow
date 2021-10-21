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
    avaliable: null
  }
};

export const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    filterData: (state, action) => {
      const { param, value } = action.payload;
      state.filters = {
        ...state.filters,
        [param]: value
      };
    }
  },
  // extraReducers: {
  //   'types/changeFilters': (state, action) => {
  //     const { payload: filters } = action;
  //     const filtersStatusOn = filters.filter(item => item.status);
  //     if (filtersStatusOn.length) {
  //       const filtersCodes = filtersStatusOn.reduce((res, cur) => {
  //         res.push(cur.id);
  //         return res;
  //       }, []);
  //       const filteredPoints = points.filter(point => point.types.some(type => filtersCodes.indexOf(type) >= 0));
  //       state.data = filteredPoints;
  //     } else {
  //       state.data = [...points.slice(0, 100)];
  //     }
  //
  //   }
  // }
});

export const { filterData } = pointsSlice.actions;

export const selectFilters = (state) => state.points.filters;
export const selectPoints = (state) => state.points.data;

export default pointsSlice.reducer;

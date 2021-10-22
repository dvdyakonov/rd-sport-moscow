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
    organization: null,
    avaliable: null,
    typeZone: null,
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
    filterData: state => {
      // const filtersStatusOn = filters.filter(item => item.status);
      // if (filtersStatusOn.length) {
      //   const filtersCodes = filtersStatusOn.reduce((res, cur) => {
      //     res.push(cur.id);
      //     return res;
      //   }, []);
      //   const filteredPoints = points.filter(point => point.types.some(type => filtersCodes.indexOf(type) >= 0));
      //   state.data = filteredPoints;
      // } else {
      //   state.data = [...points.slice(0, 100)];
      // }
    }
  },
});

export const { setFilter, filterData } = pointsSlice.actions;

export const selectFilters = (state) => state.points.filters;
export const selectPoints = (state) => state.points.data;

export default pointsSlice.reducer;

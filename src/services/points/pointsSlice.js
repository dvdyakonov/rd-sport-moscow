import { createSlice } from '@reduxjs/toolkit';
import points from 'config/points.json';

const initialState = {
  data: [...points],
  active: null,
};

export const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    filterData: (state, action) => {
      console.log("FILTER DATA");
    },
    setActive: (state, action) => {
      state.active = action.payload;
    }
  },
  extraReducers: {
    'types/changeFilters': (state, action) => {
      const { payload: filters } = action;
      const filtersStatusOn = filters.filter(item => item.status);
      if (filtersStatusOn.length) {
        const filtersCodes = filtersStatusOn.reduce((res, cur) => {
          res.push(cur.id);
          return res;
        }, []);
        const filteredPoints = points.filter(point => point.types.some(type => filtersCodes.indexOf(type) >= 0));
        state.data = filteredPoints;
      } else {
        state.data = [...points.slice(0, 100)];
      }
    }
  }
});

export const { filterData, setActive } = pointsSlice.actions;

export const selectPoints = (state) => state.points.data;
export const selectActivePoint = (state) => state.points.active;

export default pointsSlice.reducer;

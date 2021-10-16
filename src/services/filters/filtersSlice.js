import { createSlice } from '@reduxjs/toolkit';
import types from 'config/types.json';

const updatedTypes = types.map(item => { return {
  ...item,
  status: false
}});

const initialState = {
  filters: [...updatedTypes],
  total: updatedTypes.length
};

export const filtersSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {
    changeFilters: (state, action) => {
      const { payload: filters } = action;
      state.filters = [...filters];
      state.total = filters.filter(item => item.status).length || filters.length;
    }
  }
});

export const { changeFilters } = filtersSlice.actions;

export const selectFilters = (state) => state.types.filters;
export const selectTotalFilters = (state) => state.types.total;

export default filtersSlice.reducer;

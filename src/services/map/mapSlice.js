import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  options: {
    coords: [55.751244, 37.618423],
    name: 'Москва',
    zoom: 10,
    distance: 0.5,
  }
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapOptions: (state, action) => {
        const { payload: options } = action;
        state.options = options;
    }
  }
});

export const { setMapOptions } = mapSlice.actions;

export const selectMapOptions = (state) => state.map.options;

export default mapSlice.reducer;

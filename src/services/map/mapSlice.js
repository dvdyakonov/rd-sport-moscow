import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  instance: null,
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
    setMapInstance: (state, action) => {
        const { payload: instance } = action;
        state.instance = instance;
    },
    setMapOptions: (state, action) => {
        const { payload: options } = action;
        state.options = options;
    }
  }
});

export const { setMapInstance, setMapOptions } = mapSlice.actions;

export const selectMapInstance = (state) => state.map.instance;
export const selectMapOptions = (state) => state.map.options;

export default mapSlice.reducer;

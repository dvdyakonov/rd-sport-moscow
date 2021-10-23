import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from './services/points/pointsSlice';
import filtersReducer from './services/filters/filtersSlice';
import mapReducer from './services/map/mapSlice';

export default configureStore({
  reducer: {
    points: pointsReducer,
    types: filtersReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from './services/points/pointsSlice';
import polygonsReducer from './services/polygons/polygonsSlice';
import mapReducer from './services/map/mapSlice';

export default configureStore({
  reducer: {
    points: pointsReducer,
    polygons: polygonsReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

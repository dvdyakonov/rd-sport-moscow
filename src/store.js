import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from './services/points/pointsSlice';
import mapReducer from './services/map/mapSlice';

export default configureStore({
  reducer: {
    points: pointsReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

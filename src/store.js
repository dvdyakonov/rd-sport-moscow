import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from './services/points/pointsSlice';
import filtersReducer from './services/filters/filtersSlice';

export default configureStore({
  reducer: {
    points: pointsReducer,
    types: filtersReducer,
  },
});

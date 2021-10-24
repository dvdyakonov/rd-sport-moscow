import { createSlice } from '@reduxjs/toolkit';
import { intersection } from 'lodash';
import objects from 'config/objects.json';
import areas from 'config/areas.json';

const initialState = {
  data: [...objects],
  filters: {
    objectName: '',
    depart: '',
    areaName: '',
    areaType: null,
    types: [],
    avaliable: null,
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
    filterData: (state, action) => {
      const filters = action.payload;

      // Проверяем на совпадение по наименованию спортивной зоны
      let tempAreas = [];
      if (filters.areaName) {
        tempAreas = areas.filter(item => item.label.toLowerCase().indexOf(filters.areaName.toLowerCase()) !== -1);
      } else {
        tempAreas = areas;
      }

      const newArr = objects.filter(point => {
        const objectAreas = tempAreas.filter(ar => ar.objectId === point.value);

        // Проверяем на совпадение по наименованию объекта
        if (filters.objectName) {
          if(point.label.indexOf(filters.objectName) < 0) {
            return false;
          }
        }

        // Проверяем на совпадение по наименованию спортивной зоны
        if (filters.areaName) {
          if(objectAreas.length === 0) {
            return false;
          }
        }

        // Проверяем на совпадение ведомственной принадлежности
        if (filters.depart) {
          if(filters.depart.objectIds.indexOf(point.value) === -1) {
            return false;
          }
        }

        // Проверяем на доступность
        if (filters.avaliable) {
          if(point.radius !== filters.avaliable) {
            return false;
          }
        }

        // Проверяем на совпадение по видам спорта
        if (filters.types.length > 0) {
          const typeIds = filters.types.map(type => type.value);

          if(objectAreas.filter(item => intersection(typeIds, item.kindIds).length > 0).length === 0) {
            return false;
          }
        }

        // Проверяем совпадение по типам спорт зон
        if (filters.areaType) {
          if(objectAreas.filter(item => item.typeId === filters.areaType.value).filter(item => item.objectId === point.value).length === 0) {
            return false;
          }
        }

        return true;
      });

      const newArr2 = [];

      // 
      newArr.forEach(object => {
        newArr2.push({
          ...object,
          areasItems: object.areasItems.filter(area => {
            const typeIds = filters.types.map(type => type.value);
            if (intersection(typeIds, area.kindIds).length > 0){
              return true;
            }

            if (area.typeId === filters.areaType.value){
              return true;
            }
            return false;
          })
        });
      })

      state.data = [...newArr2];
    }
  },
});

export const { setFilter, filterData } = pointsSlice.actions;

export const selectFilters = (state) => state.points.filters;
export const selectPoints = (state) => state.points.data;
export const selectActivePoint = (state) => state.points.active;

export default pointsSlice.reducer;

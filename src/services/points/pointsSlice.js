import { createSlice } from '@reduxjs/toolkit';
import { intersection } from 'lodash';
import objects from 'config/objects.json';
import areas from 'config/areas.json';

const initialState = {
  data: [...objects],
  showReports: false,
  polygons: window.localStorage.getItem('userPolygons') ? JSON.parse(window.localStorage.getItem('userPolygons')) : [],
  filters: {
    objectName: '',
    depart: null,
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
    setShowReports: (state, action) => {
      state.showReports = action.payload;
    },
    setPolygons: (state, action) => {
      state.polygons = [...action.payload];
    },
    filterData: (state, action) => {
      const filters = action.payload;

      // Сократим исходный массив изначально прогнав по названию, если оно задано
      let tempAreas = [];
      if (filters.areaName) {
        tempAreas = areas.filter(item => item.label.toLowerCase().indexOf(filters.areaName.toLowerCase()) !== -1);
      } else {
        tempAreas = areas;
      }

      // Фильтруем объекты, попавшие под фильтры
      const filteredObjects = objects.filter(point => {
        // Если натыкаемся на несоответствие объекта хотя бы одному фильтру, то на другие не проверяем
        // Первыми делаем проверки с самыми низкими сложностями проходов, чтобы сложные проверки вызывались как можно реже
        const objectAreas = tempAreas.filter(ar => ar.objectId === point.value);

        // Проверяем на совпадение по наименованию объекта
        if(filters.objectName && point.label.indexOf(filters.objectName) < 0) return false;

        // Проверяем на совпадение по наименованию спортивной зоны
        if(filters.areaName && objectAreas.length === 0) return false;

        // Проверяем на совпадение ведомственной принадлежности
        if(filters.depart && filters.depart.objectIds.indexOf(point.value) === -1) return false;

        // Проверяем на доступность
        if(filters.avaliable && point.radius !== filters.avaliable) return false;

        // Проверяем на совпадение по видам спорта
        if (filters.types.length > 0) {
          const typeIds = filters.types.map(type => type.value);

          if(objectAreas.filter(item => intersection(typeIds, item.kindIds).length > 0).length === 0) return false;
        }

        // Проверяем совпадение по типам спорт зон
        if (filters.areaType) {
          if(
            objectAreas
              .filter(item => item.typeId === filters.areaType.value)
              .filter(item => item.objectId === point.value)
              .length === 0
          ) {
            return false;
          }
        }

        return true;
      });


      // Фильтруем спорт зоны внутри объекта, чтобы во всплывающей инфе отображать только попавшие под фильтры
      const objectsWithFilteredAreas = [];

      if (filters.areaType || filters.areaName || filters.types.length > 0) {
        filteredObjects.forEach(object => {
          objectsWithFilteredAreas.push({
            ...object,
            areasItems: object.areasItems.filter(area => {
              const typeIds = filters.types.map(type => type.value);
              // проверяем совпадение фильтров и видов спорта конкретной спорт зоны
              if (typeIds.length && intersection(typeIds, area.kindIds).length === 0) return false;

              // проверяем тип спорт зоны
              if (filters.areaType && area.typeId !== filters.areaType.value) return false;

              return true;
            })
          });
        })
      } else {
        objectsWithFilteredAreas.push(...filteredObjects);
      }

      state.data = [...objectsWithFilteredAreas];
    }
  },
});

export const { setFilter, filterData, setPolygons, setShowReports } = pointsSlice.actions;

export const selectShowReports = (state) => state.points.showReports;
export const selectFilters = (state) => state.points.filters;
export const selectPolygons = (state) => state.points.polygons;
export const selectPoints = (state) => state.points.data;
export const selectActivePoint = (state) => state.points.active;

export default pointsSlice.reducer;

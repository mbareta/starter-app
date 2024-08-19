import { defineStore } from 'pinia';
import request from 'admin/helpers/request';

const BASE_URL = '/courses';

export const useCoursesStore = defineStore('courses', {
  state: () => ({ catalog: [], courses: [] }),
  actions: {
    loadCatalog() {
      return request.get(`${BASE_URL}/catalog`)
        .then(({ data }) => (this.catalog = data));
    },
    loadCourses() {
      return request.get(BASE_URL).then(({ data }) => (this.courses = data));
    }
  }
});

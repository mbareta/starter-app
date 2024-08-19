import { defineStore } from 'pinia';
import request from 'public/helpers/request';

const BASE_URL = '/courses';

export const useCoursesStore = defineStore('courses', {
  state: () => ({ courses: [] }),
  actions: {
    loadCourses() {
      return request.get(BASE_URL).then(({ data }) => (this.courses = data));
    }
  }
});

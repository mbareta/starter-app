import { defineStore } from 'pinia';
import request from 'public/helpers/request';

const BASE_URL = '/courses';

export const useCoursesStore = defineStore('courses', {
  state: () => ({ courses: [], isLoading: false }),
  actions: {
    loadCourses() {
      this.isLoading = true;
      return request.get(BASE_URL).then(({ data }) => {
        this.courses = data;
        this.isLoading = false;
      });
    }
  }
});

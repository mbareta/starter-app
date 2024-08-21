import { defineStore } from 'pinia';
import request from 'admin/helpers/request';

const BASE_URL = '/courses';

export const useCoursesStore = defineStore('courses', {
  state: () => ({ catalog: [], courses: [] }),
  getters: {
    isCourseImported(state) {
      return uid => {
        return state.courses.find(it => it.uid === uid);
      }
    }
  },
  actions: {
    deleteCourse(course) {
      return request.delete(`${BASE_URL}/${course.id}`).then(() => {
        this.courses = this.courses.filter(it => it.id !== course.id);
      });
    },
    importCourse(sourceId) {
      return request.post(BASE_URL, { sourceId }).then(this.loadCourses);
    },
    loadCatalog() {
      return request.get(`${BASE_URL}/catalog`)
        .then(({ data }) => (this.catalog = data));
    },
    loadCourses() {
      return request.get(BASE_URL).then(({ data }) => (this.courses = data));
    }
  }
});

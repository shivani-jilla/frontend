import api from './api';

export const courseService = {
  getPublishedCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseDetails: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  togglePublish: async (courseId) => {
    const response = await api.patch(`/courses/${courseId}/publish`);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },

  getInstructorCourses: async (params = {}) => {
    const response = await api.get('/courses/instructor/my', { params });
    return response.data;
  },
};

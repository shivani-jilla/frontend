import api from './api';

export const enrollmentService = {
  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  getMyEnrollments: async (params = {}) => {
    const response = await api.get('/enrollments/my', { params });
    return response.data;
  },

  getCourseStudents: async (courseId, params = {}) => {
    const response = await api.get(`/courses/${courseId}/students`, { params });
    return response.data;
  },
};

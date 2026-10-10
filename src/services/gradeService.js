import api from './api';

export const gradeService = {
  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.post(`/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },

  getMyGrades: async () => {
    const response = await api.get('/grades/my');
    return response.data;
  },

  getCourseGradebook: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/gradebook`);
    return response.data;
  },
};

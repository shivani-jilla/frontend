import api from './api';

export const assignmentService = {
  getAssignmentsByCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/assignments`);
    return response.data;
  },

  getAssignmentById: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  createAssignment: async (courseId, assignmentData) => {
    const response = await api.post(`/courses/${courseId}/assignments`, assignmentData);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  },
};

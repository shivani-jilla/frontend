import api from './api';

export const submissionService = {
  submitAssignment: async (assignmentId, submissionData) => {
    const response = await api.post(`/assignments/${assignmentId}/submissions`, submissionData);
    return response.data;
  },

  getMySubmission: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data;
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  getSubmissionById: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  },
};

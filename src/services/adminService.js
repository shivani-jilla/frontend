import api from './api';

export const adminService = {
  getAdminStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getInstructorStats: async () => {
    const response = await api.get('/dashboard/instructor-stats');
    return response.data;
  },

  getStudentStats: async () => {
    const response = await api.get('/dashboard/student-stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/status`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllCoursesAdmin: async (params = {}) => {
    const response = await api.get('/admin/courses', { params });
    return response.data;
  },
};

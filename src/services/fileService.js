import api from './api';

export const fileService = {
  uploadFile: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { fileName, filePath, fileUrl }
  },

  getFileUrl: (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    return `${baseUrl}/files/${path}`;
  },
};

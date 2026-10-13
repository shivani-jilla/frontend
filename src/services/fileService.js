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
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ||
      (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
        ? 'https://backend-hbwv.onrender.com/api'
        : '/api');
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/files/${cleanPath}`;
  },
};

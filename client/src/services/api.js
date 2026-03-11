import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

// Notes
export const getNotes = () => api.get('/notes');
export const searchNotes = (q) => api.get(`/notes/search?q=${encodeURIComponent(q)}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Translate
export const translateText = (text, targetLanguage) =>
  api.post('/translate', { text, targetLanguage });

// Extract
export const extractPDF = (formData) =>
  api.post('/extract/pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const extractDOCX = (formData) =>
  api.post('/extract/docx', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

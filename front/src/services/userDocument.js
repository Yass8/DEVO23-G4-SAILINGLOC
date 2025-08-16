import { request } from "./http.js"

export const fetchUserDocuments = () => request('/user-documents');
export const fetchUserDocumentById = (id) => request(`/user-documents/${id}/show`);
export const createUserDocument = (data) => request('/user-documents/new', { method: 'POST', body: JSON.stringify(data) });
export const updateUserDocument = (id, data) => request(`/user-documents/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUserDocument = (id) => request(`/user-documents/${id}/delete`, { method: 'DELETE' });
export const fetchDocumentsByUserId = (userId) => request(`/user-documents/user/${userId}`);
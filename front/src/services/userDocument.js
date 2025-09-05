import { request } from "./http.js"

export const fetchUserDocuments = () => request('/users-documents');
export const fetchUserDocumentById = (id) => request(`/users-documents/${id}/show`);
export const createUserDocument = (data) => request('/users-documents/new', { method: 'POST', body : data });
export const updateUserDocument = (id, data) => request(`/users-documents/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUserDocument = (id) => request(`/users-documents/${id}/delete`, { method: 'DELETE' });
export const fetchDocumentsByUserId = (userId) => request(`/users-documents/user/${userId}`);
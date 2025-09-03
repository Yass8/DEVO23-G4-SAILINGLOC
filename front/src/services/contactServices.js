import { request } from "./http.js"

export const sendContactForm = (data) => request('/contact/send', { method: 'POST', body: JSON.stringify(data) });
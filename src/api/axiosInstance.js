import axios from 'axios';

/**
 * Axios instance configured with the API base URL.
 * Credentials (session cookie) are included with every request.
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export default api;

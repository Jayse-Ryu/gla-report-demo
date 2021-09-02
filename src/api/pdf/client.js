import axios from 'axios';
import errorResponseInterceptor from '../interceptors';

const baseURL = process.env.VUE_APP_PDF_SERVER_HOST;

const client = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

// Interceptors here....
client.interceptors.response.use(
  (response) => response,
  errorResponseInterceptor,
);

export default client;

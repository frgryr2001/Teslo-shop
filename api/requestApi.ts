import axios from 'axios';

const requestApi = axios.create({
  baseURL: '/api',
});
export default requestApi;

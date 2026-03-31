import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3069'
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};
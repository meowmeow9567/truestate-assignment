import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

export async function fetchFilters() {
  const res = await api.get('/sales/filters');
  return res.data;
}

export async function fetchSales(params) {
  const res = await api.get('/sales', { params });
  return res.data;
}

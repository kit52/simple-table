import axios from 'axios';
import { Product } from '../types';
axios.defaults.baseURL = 'http://localhost:3000/products';

export const fetchDataProducts = () => {
  return axios.get<Product[]>('');
};
export const createProduct = (product: Product) => {
  return axios.post<Product[]>('', product);
};
export const updateProduct = (product: Product) => {
  return axios.put<Product[]>(`/${product.id}`, product);
};
export const deleteProduct = (productId: number) => {
  return axios.delete<Product[]>(`/${productId}`);
};

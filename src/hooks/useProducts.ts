import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useProducts = () => {
  const { products, loading, loadProducts } = useStore();

  useEffect(() => {
    if (products.length === 0 && !loading) {
      loadProducts();
    }
  }, [products.length, loading, loadProducts]);

  return { products, loading, loadProducts };
};
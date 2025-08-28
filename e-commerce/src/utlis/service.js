import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utlis/api';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => api.post('/api/add-to-cart/', { product: productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error);
    },
  });
}

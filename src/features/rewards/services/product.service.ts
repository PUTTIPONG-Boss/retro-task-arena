import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { BackendProduct, Product, CreateProductPayload } from '../types';

// ── Mapper: Backend → Frontend ────────────────────────────────────────────────
const mapBackendProductToProduct = (p: BackendProduct): Product => ({
  id: p.id,
  code: p.sku,
  name: p.name,
  description: p.description,
  price: p.price,
  stock: p.stock,
});

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/product — public endpoint, no auth required.
 * Returns all products from the backend, mapped to the frontend Product type.
 */
export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get<BackendProduct[]>('/product');
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(mapBackendProductToProduct);
    },
  });
};

/**
 * POST /api/v1/product — protected endpoint, requires JWT in Authorization header.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const response = await apiClient.post('/product', payload);
      return response.data;
    },
    onSuccess: () => {
      // Refetch the product list after a successful create
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

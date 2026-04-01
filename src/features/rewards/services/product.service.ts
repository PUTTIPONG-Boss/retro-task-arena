import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { BackendProduct, Product, CreateProductPayload, UpdateProductPayload } from '../types';

// ── Mapper: Backend → Frontend ────────────────────────────────────────────────
const mapBackendProductToProduct = (p: BackendProduct): Product => ({
  id: p.id,
  // code: p.sku,
  name: p.name,
  description: p.description,
  price: p.price,
  stock: p.stock,
  category: p.category,
  imageUrl: p.imageUrl,
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

/**
 * GET /api/v1/product/:id — protected endpoint.
 */
export const useGetProductById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      if (!id) throw new Error('Product ID is required');
      const response = await apiClient.get<BackendProduct>(`/product/${id}`);
      return mapBackendProductToProduct(response.data);
    },
    enabled: !!id,
  });
};

/**
 * PUT /api/v1/product/:id — protected endpoint.
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProductPayload }) => {
      const response = await apiClient.patch(`/product/${id}`, payload);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

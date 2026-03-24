// ── Backend Response Shape (lowercase/camelCase — matches Go JSON tags) ──────────
export interface BackendProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// ── Frontend Display Model (camelCase) ────────────────────────────────────────
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

// ── Payload for creating a product (POST /product — requires JWT) ─────────────
export interface CreateProductPayload {
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
}

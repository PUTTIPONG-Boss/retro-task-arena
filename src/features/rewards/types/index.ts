// ── Backend Response Shape (PascalCase — matches Go JSON tags) ──────────────
export interface BackendProduct {
  ID: string;
  Code: string;
  Name: string;
  Description: string;
  Price: number;
  Stock: number;
  CreatedAt: string;
  UpdatedAt: string;
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
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

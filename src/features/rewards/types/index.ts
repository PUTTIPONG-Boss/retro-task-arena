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

// ── Payload for creating an order (POST /order) ───────────────────────────────
export interface OrderItemPayload {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface CreateOrderPayload {
  orderItems: OrderItemPayload[];
  paymentMethod: 'POINTS' | 'THB';
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  discount: number;
  totalPrice: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  subTotal: number;
  discount: number;
  tax: number;
  totalPrice: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  orderItems: OrderItem[];
  createdAt: string;
}

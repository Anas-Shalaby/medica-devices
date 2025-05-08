// src/services/api/types.ts
export interface Device {
  _id: string;
  name: string;
  manufacturer: string;
  model: string;
  price: {
    amount: number;
    currency: string;
  };
  availability: {
    inStock: boolean;
    quantity: number;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "supplier" | "user";
  createdAt: string;
  lastLogout: string | null;
  __v: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: {
    user: string;
    name: string;
    email: string;
  };
  supplier: {
    user: string;
    companyName: string;
  };
  items: Array<{
    device: string;
    name: string;
    quantity: number;
    unitPrice: {
      amount: number;
      currency: string;
    };
  }>;
  status: string;
  billing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  count?: number;
}

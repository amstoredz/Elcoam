export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  products: { productId: string; quantity: number; name: string; price: number }[];
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    baladiya: string;
  };
  createdAt: string;
}
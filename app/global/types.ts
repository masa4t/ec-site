export interface Image {
  url: string;
}

export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string[];
  images: Image[];
  amount: number;
}

export interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

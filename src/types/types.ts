export interface Dimension {
  width: number;
  height: number;
  depth: number;
}

export interface ProductItem {
  brand: string;
  category: string;
  description: string;
  title: string;
  dimensions: Dimension;
  price: number;
  weight: number;
  images: string[];
}

export interface UserAccount {
  id?: number;
  address: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardNum: string;
  cvv: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  orders: ProductItem[];
  wishList: ProductItem[];
}
export interface LoginCredentials {
  id?: number;
  email: string;
  password: string;
}

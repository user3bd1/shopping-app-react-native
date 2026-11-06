export interface Dimension {
  width: number;
  height: number;
  depth: number;
}

export interface ProductItem {
  id?: number;
  brand: string;
  category: string;
  description: string;
  title: string;
  dimensions: Dimension;
  price: number;
  weight: number;
  images: string[];
}

interface OrderdOrders {
  OrderdOrders: Record<string, OrderdOrders>;
}

export interface UserInfo {
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
  userImage: string;
  orders: ProductItem[];
  wishList: ProductItem[];
  orderdOrders: {
    [key: string]: OrderdOrders;
  };
}
export interface LoginCredentials {
  id?: number;
  email: string;
  password: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
}

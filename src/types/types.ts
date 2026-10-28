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

export interface UserInfo {
  address: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardNum: string;
  cvv: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
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

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
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
  dimensions: Dimension;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export type Screen = 'catalog' | 'pdp' | 'cart' | 'checkout' | 'order-success' | 'auth' | 'account';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface GalleryImage {
  url: string;
  label: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  colorName: string;
  colorHex: string;
  colors: ProductColor[];
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  verifiedRatingsCount: number;
  sizes: string[];
  image: string;
  gallery: GalleryImage[];
  badge?: string;
  bestseller?: boolean;
  fitTag: string;
  specs: {
    gsm: string;
    material: string;
    fit: string;
    neckline: string;
  };
  highlights: string[];
  description: string[];
  careInstructions: string[];
  returnsPolicy: string[];
  gender: ('men' | 'women')[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
  mrp: number;
  customImage?: string;
}

export interface DeliveryAddress {
  fullName: string;
  tag: 'HOME' | 'WORK' | 'OTHER';
  addressLine: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

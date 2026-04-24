export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  language: 'en' | 'hi';
  createdAt: string;
}

export interface Service {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  category: string;
  description: { en: string; hi: string };
  shortDesc: { en: string; hi: string };
  originalPrice: number;
  offerPrice: number;
  icon: string;
  image?: string;
  features: { en: string; hi: string }[];
  formFields: string[];
  redirectType: 'razorpay' | 'whatsapp' | 'form';
  isActive: boolean;
  showOnHome: boolean;
  totalBookings: number;
  seo: { title: string; description: string; keywords: string };
}

export interface Product {
  _id: string;
  name: { en: string; hi: string };
  slug: string;
  category: string;
  description: { en: string; hi: string };
  benefits: string[];
  price: number;
  offerPrice: number;
  images: string[];
  stock: number;
  sku?: string;
  isFeatured: boolean;
  isNewLaunch: boolean;
  isActive: boolean;
  totalSold: number;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  _id: string;
  orderId: string;
  customerInfo: { name: string; email: string; phone: string; address: string; city: string; pincode: string };
  items: { name: string; price: number; qty: number; image: string }[];
  totalAmount: number;
  status: string;
  paymentId?: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  name: string;
  phone: string;
  email?: string;
  serviceName: string;
  amount: number;
  formData?: Record<string, any>;
  status: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  content: { en: string; hi: string };
  excerpt: { en: string; hi: string };
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  seo: { title: string; description: string };
}

export interface SiteSettings {
  siteName: string;
  tagline: { en: string; hi: string };
  logo?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  socialLinks: { instagram?: string; facebook?: string; youtube?: string; twitter?: string };
  seo: { defaultTitle: string; defaultDescription: string; ogImage?: string };
  enableHindi: boolean;
}

export interface Slider {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Popup {
  _id: string;
  title: string;
  content: string;
  image?: string;
  ctaText: string;
  ctaLink: string;
  delay: number;
  isActive: boolean;
  type: string;
}

export type Lang = 'en' | 'hi';

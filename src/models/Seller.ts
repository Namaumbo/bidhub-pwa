import type { Category } from './Request';

export interface SellerProfile {
  id: string;
  name: string;
  rating: number;
  phone: string;
  location: string;
  lat: number;
  lng: number;
  categories: Category[];
  totalSales: number;
  bio?: string;
}

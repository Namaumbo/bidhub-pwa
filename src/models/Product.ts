export type Category = 'phones' | 'fashion' | 'electronics' | 'cars' | 'farming' | 'household' | 'beauty';

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  location: string;
  status: 'available' | 'sold';
  createdAt: number;
  sellerName: string;
  sellerRating: number;
}

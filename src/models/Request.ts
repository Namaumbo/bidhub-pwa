export type Category = 'phones' | 'fashion' | 'electronics' | 'cars' | 'farming' | 'household' | 'beauty';

export interface BuyerRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  title: string;
  description: string;
  budget: number;
  category: Category;
  location: string;
  images?: string[];
  status: 'open' | 'accepted' | 'closed';
  createdAt: number;
  bidCount: number;
}

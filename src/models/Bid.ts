export interface Bid {
  id: string;
  requestId: string;
  requestTitle: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  price: number;
  description: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

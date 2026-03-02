export type ReturnStatus = 'requested' | 'approved' | 'rejected';
export type ReturnType = 'return' | 'exchange';

export interface ReturnItem {
  return_id: string;
  order_id: string;
  return_type: ReturnType;
  reason: string;
  details: string | null;
  status: ReturnStatus;
  created_at: string;
  orders: {
    order_id: string;
    status: string;
    total_amount: number;
    order_date: string;
    user_id: string;
    order_items: {
      product_id: string;
      size: string;
      quantity: number;
      price: number;
      products: {
        title: string;
      } | null;
    }[];
  } | null;
}

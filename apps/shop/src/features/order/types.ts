export type OrderStatus =
  | 'paid'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'cancel_requested'
  | 'return_requested'
  | 'return_approved'
  | 'returned'
  | 'exchange_requested'
  | 'exchange_approved'
  | 'shipped_again';

export interface CancellationInfo {
  reason: string;
  requestedAt: string;
  status: 'requested' | 'completed' | 'rejected';
}

export interface ReturnInfo {
  returnType: 'return' | 'exchange';
  reason: string;
  details?: string;
  requestedAt: string;
  status: 'requested' | 'approved' | 'rejected' | 'completed';
}

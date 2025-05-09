import type { OrderProductItem } from '@/features/order-sheet/types';

const DELIVERY_FEE = 3000;

export function createOrderSheetSummary(orderSheetItems: OrderProductItem[]) {
  const totalPrice = orderSheetItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalPriceWithDeliveryFee = totalPrice + DELIVERY_FEE;

  const orderName =
    orderSheetItems.length === 1
      ? orderSheetItems[0].title
      : `${orderSheetItems[0].title} 외 ${orderSheetItems.length - 1}건`;

  return {
    totalPrice,
    totalPriceWithDeliveryFee,
    orderName,
  };
}

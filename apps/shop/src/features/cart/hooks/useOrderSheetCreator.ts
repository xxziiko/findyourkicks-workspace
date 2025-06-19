import type { CartItem } from '@/features/cart';
import { useCreateOrderSheetMutation } from '@/features/order-sheet';

export function useOrderSheetCreator({
  cartItems,
  checkedItems,
  onSuccess,
}: {
  cartItems: CartItem[];
  checkedItems: Record<string, boolean>;
  onSuccess: (data: { orderSheetId: string }) => void;
}) {
  const { mutate: mutateCreateOrderSheet, isPending: isMutatingOrderSheet } =
    useCreateOrderSheetMutation({
      onSuccess,
    });

  const createOrderSheetFrom = (filterFn: (item: CartItem) => boolean) => {
    return cartItems.filter(filterFn).map((item) => ({
      productId: item.productId,
      size: item.selectedOption.size,
      price: item.price,
      quantity: item.quantity,
      id: item.cartItemId,
    }));
  };

  const handleOrderSheet = () => {
    const payload = createOrderSheetFrom(
      (item: CartItem) => !!checkedItems[item.cartItemId],
    );

    mutateCreateOrderSheet(payload);
  };

  const handleOrderSheetForSingleProduct = (cartItemId: string) => {
    const payload = createOrderSheetFrom(
      (item) => item.cartItemId === cartItemId,
    );

    mutateCreateOrderSheet(payload);
  };

  return {
    handleOrderSheet,
    handleOrderSheetForSingleProduct,
    isMutatingOrderSheet,
  };
}

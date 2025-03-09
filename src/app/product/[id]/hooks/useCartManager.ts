import { cartItemsAtom, isAuthenticatedAtom } from '@/app/lib/store';
import type { CartItem } from '@/types/product';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

interface CartManagerProps {
  createCart: () => CartItem[];
  resetSelectedOptions: () => void;
}

export default function useCartManager({
  createCart,
  resetSelectedOptions,
}: CartManagerProps) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setCart = useSetAtom(cartItemsAtom);
  const router = useRouter();

  const mergeCartItems = (updatedCart: CartItem[]) => {
    const cartItems = createCart();

    cartItems.forEach((newItem) => {
      const index = updatedCart.findIndex(
        (cartItem) => cartItem.size === newItem.size,
      );

      if (index !== -1) {
        updatedCart[index].quantity += newItem.quantity;
        return;
      }

      updatedCart.push(newItem);
    });
  };

  const addCart = () => {
    setCart((prev) => {
      const updatedCart = [...prev];
      mergeCartItems(updatedCart);

      return updatedCart;
    });
    resetSelectedOptions();
  };

  const goToLogin = () => {
    router.push('/login');
  };

  const handleCartButton = () => {
    if (isAuthenticated) {
      addCart();
      return;
    }

    goToLogin();
  };

  return { handleCartButton };
}

import type { CartItem } from '@/features/cart/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Pure logic extracted from useCart for unit testing.
//
// useCart is a React hook that combines:
//   - useCartQuery()   -> CartItem[]
//   - useCheckBoxGroup -> checkedItems map
//
// We test the three derived values (totalProduct, totalPrice,
// totalPriceWithDeliveryFee) by calling the same expressions the hook uses,
// driven by controlled fixture data.  This keeps tests focused on business
// logic rather than React rendering.
// ---------------------------------------------------------------------------

// ---- helpers ---------------------------------------------------------------

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    cartItemId: 'item-1',
    productId: 'prod-1',
    title: 'Test Shoe',
    image: 'https://example.com/shoe.jpg',
    selectedOption: { size: '270', stock: 10 },
    quantity: 1,
    price: 100000,
    addedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/** Mirrors the three derived calculations in useCart exactly. */
function computeCartTotals(
  cartItems: CartItem[],
  checkedItems: Record<string, boolean>,
) {
  const totalProduct = Object.values(checkedItems).filter(Boolean).length;

  const totalPrice = cartItems
    .filter((item) => checkedItems[item.cartItemId] ?? false)
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const totalPriceWithDeliveryFee = totalProduct === 0 ? 0 : totalPrice + 3000;

  return { totalProduct, totalPrice, totalPriceWithDeliveryFee };
}

// ---- tests -----------------------------------------------------------------

describe('cart totals calculation', () => {
  // ----- empty cart ---------------------------------------------------------

  describe('when the cart is empty', () => {
    it('returns 0 for totalProduct', () => {
      const { totalProduct } = computeCartTotals([], {});
      expect(totalProduct).toBe(0);
    });

    it('returns 0 for totalPrice', () => {
      const { totalPrice } = computeCartTotals([], {});
      expect(totalPrice).toBe(0);
    });

    it('returns 0 for totalPriceWithDeliveryFee (no delivery fee when cart is empty)', () => {
      const { totalPriceWithDeliveryFee } = computeCartTotals([], {});
      expect(totalPriceWithDeliveryFee).toBe(0);
    });
  });

  // ----- single checked item ------------------------------------------------

  describe('when a single item is checked', () => {
    const item = makeItem({ cartItemId: 'a', price: 100000, quantity: 1 });
    const checkedItems = { a: true };

    it('counts 1 checked product', () => {
      const { totalProduct } = computeCartTotals([item], checkedItems);
      expect(totalProduct).toBe(1);
    });

    it('calculates totalPrice as price * quantity', () => {
      const { totalPrice } = computeCartTotals([item], checkedItems);
      expect(totalPrice).toBe(100000);
    });

    it('adds 3000 KRW delivery fee when at least one item is checked', () => {
      const { totalPriceWithDeliveryFee } = computeCartTotals(
        [item],
        checkedItems,
      );
      expect(totalPriceWithDeliveryFee).toBe(103000);
    });
  });

  // ----- multiple checked items ---------------------------------------------

  describe('when multiple items are checked', () => {
    const itemA = makeItem({ cartItemId: 'a', price: 50000, quantity: 2 });
    const itemB = makeItem({ cartItemId: 'b', price: 30000, quantity: 1 });
    const checkedItems = { a: true, b: true };

    it('counts all checked products', () => {
      const { totalProduct } = computeCartTotals([itemA, itemB], checkedItems);
      expect(totalProduct).toBe(2);
    });

    it('sums price * quantity for each checked item', () => {
      // 50000 * 2 + 30000 * 1 = 130000
      const { totalPrice } = computeCartTotals([itemA, itemB], checkedItems);
      expect(totalPrice).toBe(130000);
    });

    it('adds a single 3000 KRW delivery fee regardless of item count', () => {
      const { totalPriceWithDeliveryFee } = computeCartTotals(
        [itemA, itemB],
        checkedItems,
      );
      expect(totalPriceWithDeliveryFee).toBe(133000);
    });
  });

  // ----- partial selection --------------------------------------------------

  describe('when only some items are checked', () => {
    const itemA = makeItem({ cartItemId: 'a', price: 80000, quantity: 1 });
    const itemB = makeItem({ cartItemId: 'b', price: 20000, quantity: 3 });
    const checkedItems = { a: true, b: false };

    it('counts only the checked items', () => {
      const { totalProduct } = computeCartTotals([itemA, itemB], checkedItems);
      expect(totalProduct).toBe(1);
    });

    it('includes only checked items in totalPrice', () => {
      const { totalPrice } = computeCartTotals([itemA, itemB], checkedItems);
      expect(totalPrice).toBe(80000);
    });

    it('adds delivery fee because at least one item is checked', () => {
      const { totalPriceWithDeliveryFee } = computeCartTotals(
        [itemA, itemB],
        checkedItems,
      );
      expect(totalPriceWithDeliveryFee).toBe(83000);
    });
  });

  // ----- all unchecked (items exist but none selected) ----------------------

  describe('when all items are unchecked', () => {
    const item = makeItem({ cartItemId: 'a', price: 100000, quantity: 1 });
    const checkedItems = { a: false };

    it('returns 0 for totalProduct', () => {
      const { totalProduct } = computeCartTotals([item], checkedItems);
      expect(totalProduct).toBe(0);
    });

    it('returns 0 for totalPrice', () => {
      const { totalPrice } = computeCartTotals([item], checkedItems);
      expect(totalPrice).toBe(0);
    });

    it('returns 0 for totalPriceWithDeliveryFee (no delivery fee when nothing is selected)', () => {
      const { totalPriceWithDeliveryFee } = computeCartTotals(
        [item],
        checkedItems,
      );
      expect(totalPriceWithDeliveryFee).toBe(0);
    });
  });

  // ----- price coercion (price stored as number but typed loosely) ----------

  describe('price type coercion', () => {
    it('handles price stored as a string-like number via Number() coercion', () => {
      // The hook uses Number(item.price) — verify the same cast works
      const item = makeItem({
        cartItemId: 'a',
        price: '99000' as unknown as number,
        quantity: 2,
      });
      const { totalPrice } = computeCartTotals([item], { a: true });
      expect(totalPrice).toBe(198000);
    });
  });

  // ----- maximum quantity edge case ----------------------------------------

  describe('edge case: high quantity', () => {
    it('calculates total correctly for large quantity values', () => {
      const item = makeItem({ cartItemId: 'a', price: 10000, quantity: 999 });
      const { totalPrice } = computeCartTotals([item], { a: true });
      expect(totalPrice).toBe(9990000);
    });
  });

  // ----- delivery fee is always exactly 3000 --------------------------------

  describe('delivery fee', () => {
    it('is exactly 3000 KRW when at least one item is selected', () => {
      const item = makeItem({ cartItemId: 'a', price: 1, quantity: 1 });
      const { totalPrice, totalPriceWithDeliveryFee } = computeCartTotals(
        [item],
        { a: true },
      );
      expect(totalPriceWithDeliveryFee - totalPrice).toBe(3000);
    });

    it('is not added when no items are selected', () => {
      const item = makeItem({ cartItemId: 'a', price: 1, quantity: 1 });
      const { totalPriceWithDeliveryFee } = computeCartTotals([item], {
        a: false,
      });
      expect(totalPriceWithDeliveryFee).toBe(0);
    });
  });
});

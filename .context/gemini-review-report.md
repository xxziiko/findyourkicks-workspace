# Gemini Review Report

Generated: 2026-03-02

---

## 1. API Route Error Handling Issues (`apps/shop/src/app/api/`)

### `api/auth/callback/route.ts`
- **Line 13**: `exchangeCodeForSession(code)` is called inside an `if (code)` block, but if `code` is null the function falls through to redirect to the error page — this is intentional and acceptable. No missing try/catch, but the outer function is not wrapped; an unexpected thrown exception from `createClient()` or `new URL()` would be unhandled.

### `api/auth/test-account/route.ts`
- **Line 8–11**: `supabase.auth.signInWithPassword` is called without a try/catch. Error is handled via the `assert` utility, but if `assert` itself throws, the thrown error propagates uncaught out of the route handler (no wrapping try/catch).
- **Line 10**: `process.env.TEST_ACCOUNT_PW` is used directly as a password parameter with type `string | undefined`. If the env var is absent this silently passes `undefined` to the auth call.

### `api/cart/count/route.ts`
- **Line 23**: `console.error('장바구니 개수 조회 실패', countError)` — remaining `console.error` after cleanup. Returns `{ count: 0 }` silently on error with status 200 instead of an error status.

### `api/cart/items/route.ts` (GET handler)
- **Line 38**: `console.error('장바구니 조회 실패', cartError)` — remaining `console.error`. Returns `[]` with status 200 on error instead of an error status.

### `api/cart/items/route.ts` (POST handler)
- **Lines 86–90**: `supabase.from('cart').select(...)` result is destructured but the error (`error` field) is ignored — no check on the error from the existing cart lookup. If the DB call fails, `cartId` will be `undefined` and the subsequent insert path may silently create a duplicate or fail unexpectedly.

### `api/order-sheets/route.ts`
- **Lines 30–42**: The new address `insert` result (`data: address`) is captured but never used after the insert. If `addressError` triggers, a 500 is returned, but the successfully inserted `address.address_id` is never assigned to `defaultAddress` for subsequent use — `defaultAddress` remains `undefined`, so `user_address_id` on line 50 will be `undefined`.

### `api/order-sheets/[orderSheetId]/route.ts`
- **Line 27**: `console.error('주문 아이템 조회 실패:', itemsError)` — remaining `console.error`.
- **Line 61**: `console.error('배송 정보 조회 실패', deliveryError)` — remaining `console.error`.
- **Line 62–65**: Error response is returned as `NextResponse.json({ error: '...', status: 404 })` — the HTTP status is embedded in the body rather than passed as the second argument to `NextResponse.json()`. The actual HTTP status code will be 200.

### `api/orders/[orderId]/route.ts`
- **Line 38**: `console.error('addressesError', addressesError)` — remaining `console.error`.
- **Line 56**: `console.error('itemsError', itemsError)` — remaining `console.error`.
- **Lines 33–35 / 63–66**: If `orders` or `payment` arrays are empty (no rows found), the code accesses `orders[0]` and `payment[0]` without a length guard, which will throw a runtime error (`Cannot read properties of undefined`).

### `api/orders/route.ts` (POST handler — payment processing)
- **Lines 281–282**: `deleteError` from cart item deletion is caught but the `if (deleteError) {}` block is **empty** — cart deletion failures are silently swallowed with no logging, no error response, and no retry.
- **Lines 293–294**: `error` from `decrease_stock` RPC is captured but the `if (error) {}` block is **empty** — stock decrement failures are silently ignored. This is a critical data integrity issue: payment can complete while inventory is not decremented.
- **Lines 163–166**: `paymentResult.easyPay.provider` is accessed without null-checking `paymentResult.easyPay`. If the payment method is not easy pay (e.g., card), this will throw a runtime error.

### `api/payments/route.ts`
- **Lines 52–58**: Auth check uses `supabase.auth.getUser()` without capturing the `error` field. If the auth call itself fails, `user` will be `null` and the code returns a 401, but a DB error from `getUser` is not distinguished from a genuinely unauthenticated request.

### `api/users/addresses/route.ts` (POST handler)
- **Lines 8–9**: `supabase.auth.getUser()` result captures `userError` but it is never checked — `userError` is declared but unused. If authentication fails, `user.user?.id` will be `undefined` and the subsequent address query will silently use an undefined user ID.

### `api/users/addresses/route.ts` (GET handler)
- **Line 62**: `supabase.auth.getUser()` result is destructured as `{ data }` only — error is not captured or checked. Unauthenticated requests will use `undefined` as `user_id` in the DB query.

### `api/users/addresses/default/route.ts`
- **Line 6**: `supabase.auth.getUser()` error is not captured or checked. If auth fails, `user.user?.id` is `undefined` and the DB query proceeds with an undefined user ID, potentially leaking or corrupting data.

---

## 2. Admin Mutation Hooks Missing `onError` (`apps/admin/src/`)

| File | Has `onError`? | Notes |
|---|---|---|
| `features/auth/hooks/mutations/useSignInMutation.ts` | No | No `onSuccess` or `onError` — callers handle errors via the returned mutation object |
| `features/auth/hooks/mutations/useSignOutMutation.ts` | No | Has `onSuccess` callback prop, but no `onError` |
| `features/product/hooks/mutations/useImageMutation.ts` | No | No `onSuccess` or `onError` callbacks at all |
| `features/product/hooks/mutations/useProductMutation.ts` | No | Has `onSuccess` callback prop, but no `onError` |

All four admin mutation hooks are missing `onError` callbacks.

---

## 3. `useProductMutation.ts` — `onError` Handling Gap (Detail)

**File**: `apps/admin/src/features/product/hooks/mutations/useProductMutation.ts`

```ts
// Line 4-9 (current implementation)
export function useProductMutation({ onSuccess }: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: postProduct,
    onSuccess,
    // onError is absent
  });
}
```

**What is missing:**

1. **No `onError` prop in the hook's parameter interface** — callers cannot inject an error handler at the hook call site without modifying the hook.
2. **No default `onError` inside the hook** — if `postProduct` rejects (e.g., network error, server 500), the mutation silently fails with no user feedback and no error logging.
3. **No error toast / notification** — without `onError`, the admin UI has no mechanism to inform the operator that product creation failed.
4. **Unhandled rejection in some React Query versions** — depending on the React Query configuration and error boundary setup, an unhandled mutation error may propagate as an unhandled promise rejection.

**Recommended fix:**
```ts
export function useProductMutation({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: postProduct,
    onSuccess,
    onError,
  });
}
```

The same pattern applies to `useSignOutMutation` and `useImageMutation`.

import type { CartItem, CartList } from '@/features/cart';
import { OrderProduct } from '@/features/order';
import {
  Button,
  CheckBox,
  NoData,
  QuantityController,
} from '@/shared/components';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import styles from './CartTable.module.scss';

interface CartTableProps {
  cartItems: CartList;
  isAllChecked: boolean;
  checkedItems: { [cartId: string]: boolean };
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => void;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onDelete: (cartItemId: string) => void;
  onCreateOrderSheetForSingleProduct: (cartItemId: string) => void;
}

interface HeaderProps {
  isAllChecked: boolean;
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TableRowProps {
  item: CartItem;
  checkedItems: { [cartId: string]: boolean };
  onToggle: (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => void;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onDelete: (cartItemId: string) => void;
  onCreateOrderSheetForSingleProduct: (cartItemId: string) => void;
}

export default function CartTable(props: CartTableProps) {
  const { isAllChecked, cartItems, checkedItems, onToggleAll, ...rest } = props;

  const headerProps = { isAllChecked, onToggleAll };
  const itemProps = {
    checkedItems,
    ...rest,
  };

  return (
    <div className={styles.list}>
      <Header {...headerProps} />

      {!cartItems.length && (
        <NoData
          title="장바구니가 비어있어요!"
          icon={<ShoppingCartIcon width="2rem" />}
        />
      )}
      {cartItems.map((item) => (
        <TableRow key={item.cartItemId} {...itemProps} item={item} />
      ))}
    </div>
  );
}

function Header({ isAllChecked, onToggleAll }: HeaderProps) {
  return (
    <div className={styles.list__header}>
      <CheckBox checked={isAllChecked} onChange={onToggleAll} />
      <p>상품/옵션 정보</p>
      <p>수량</p>
      <p>주문 금액</p>
      <div />
    </div>
  );
}

function TableRow({
  item,
  checkedItems,
  onToggle,
  onQuantityChange,
  onDelete,
  onCreateOrderSheetForSingleProduct,
}: TableRowProps) {
  const { cartItemId, productId, selectedOption, quantity, price } = item;

  return (
    <li className={styles.item}>
      <CheckBox
        checked={checkedItems[cartItemId]}
        onChange={(e) => onToggle(e, cartItemId)}
      />

      <Link href={`/product/${productId}`} className={styles.item__info}>
        <OrderProduct
          product={{ ...item, size: selectedOption.size, id: cartItemId }}
          type="cart"
        />
      </Link>

      <div className={styles.item__quantity}>
        <QuantityController
          id={cartItemId}
          quantity={quantity}
          inventory={selectedOption}
          onQuantityChange={onQuantityChange}
        />
      </div>

      <div className={styles.item__price}>
        <p>{(Number(price) * quantity).toLocaleString()}원</p>
      </div>

      <div className={styles.item__buttons}>
        <Button
          text="주문하기"
          onClick={() => onCreateOrderSheetForSingleProduct(cartItemId)}
        />
        <Button
          text="삭제하기"
          onClick={() => onDelete(cartItemId)}
          variant="lined--r"
        />
      </div>
    </li>
  );
}

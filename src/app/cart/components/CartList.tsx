'use client';

import { Button, CheckBox, Image, QuantityController } from '@/components';
import type { CartItem } from '@/types/product';
import Link from 'next/link';
import { memo, useCallback } from 'react';
import { NoListData } from '../ui/index';
import styles from './CartList.module.scss';

export interface CartListProps extends HandlerType {
  cartItems: CartItem[];
  checkedItems: { [cartId: string]: boolean };
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface HeaderProps {
  allChecked: boolean;
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface ItemProps extends HandlerType {
  item: CartItem;
  checked: (cartId: string) => boolean;
}
interface HandlerType {
  onQuantityChange: (cartId: string, quantity: number) => () => void;
  onDelete: (cartId: string) => () => void;
  onToggle: (
    cartId: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CartList(props: CartListProps) {
  const { cartItems, checkedItems, onToggleAll, ...rest } = props;

  const allChecked = cartItems.every((item) => checkedItems[item.cartId]);
  const checked = useCallback(
    (cartId: string) => checkedItems[cartId] || false,
    [checkedItems],
  );

  const headerProps = { allChecked, onToggleAll };
  const itemProps = {
    checkedItems,
    checked,
    ...rest,
  };

  return (
    <div className={styles.list}>
      <Header {...headerProps} />

      {!cartItems.length && <NoListData />}
      {cartItems.map((item) => (
        <MemorizedItem key={item.cartId} item={item} {...itemProps} />
      ))}
    </div>
  );
}

function Header({ allChecked, onToggleAll }: HeaderProps) {
  return (
    <div className={styles.list__header}>
      <CheckBox checked={allChecked} onChange={onToggleAll} />
      <p>상품/옵션 정보</p>
      <p>수량</p>
      <p>주문 금액</p>
      <div />
    </div>
  );
}

function Item({
  item,
  checked,
  onToggle,
  onQuantityChange,
  onDelete,
}: ItemProps) {
  return (
    <li className={styles.item}>
      <CheckBox
        checked={checked(item.cartId)}
        onChange={onToggle(item.cartId)}
      />

      <Link
        href={`/product/${item.productId}`}
        className={styles.item__info_box}
      >
        <Image src={item.imageUrl} alt="product" width="8rem" height="7rem" />

        <div className={styles.item__info}>
          <p>{item.title.replace(/(<b>|<\/b>)/g, '')}</p>
          <p>{item.size}</p>
          <p>{item.price.toLocaleString()}원</p>
        </div>
      </Link>

      <div className={styles.item__quantity}>
        <QuantityController
          size={item.size}
          quantity={item.quantity}
          onIncrement={onQuantityChange(item.cartId, item.quantity + 1)}
          onDecrement={onQuantityChange(item.cartId, item.quantity - 1)}
        />
      </div>

      <div className={styles.item__price}>
        <p>{(item.price * item.quantity).toLocaleString()}원</p>
      </div>

      <div className={styles.item__buttons}>
        <Button text="주문하기" onClick={() => {}} />
        <Button
          text="삭제하기"
          onClick={onDelete(item.cartId)}
          variant="white"
        />
      </div>
    </li>
  );
}

const MemorizedItem = memo(Item);

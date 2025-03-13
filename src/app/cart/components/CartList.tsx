'use client';

import { Button, CheckBox, Image, QuantityController } from '@/components';
import type { CartItem } from '@/types/product';
import { memo } from 'react';
import { NoListData } from '../ui/index';
import styles from './CartList.module.scss';

export interface CartListProps extends HandlerType {
  items: CartItem[];
  checkedItems: { [cartId: string]: boolean };
  handleToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface HeaderProps {
  allChecked: boolean;
  handleToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface ItemProps extends HandlerType {
  item: CartItem;
  checked: (cartId: string) => boolean;
}
interface HandlerType {
  handleQuantityChange: (cartId: string, quantity: number) => () => void;
  handleDelete: (cartId: string) => () => void;
  handleToggle: (
    cartId: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CartList(props: CartListProps) {
  const { items, checkedItems, handleToggleAll, ...rest } = props;

  const allChecked = items.every((item) => checkedItems[item.cartId]);
  const checked = (cartId: string) => checkedItems[cartId] || false;

  const headerProps = { allChecked, handleToggleAll };
  const itemProps = {
    checkedItems,
    checked,
    ...rest,
  };

  return (
    <div className={styles.list}>
      <Header {...headerProps} />

      {!items.length && <NoListData />}
      {items.map((item) => (
        <MemorizedItem key={item.cartId} item={item} {...itemProps} />
      ))}
    </div>
  );
}

function Header({ allChecked, handleToggleAll }: HeaderProps) {
  return (
    <div className={styles.list__header}>
      <CheckBox checked={allChecked} onChange={handleToggleAll} />
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
  handleToggle,
  handleQuantityChange,
  handleDelete,
}: ItemProps) {
  return (
    <li className={styles.item}>
      <CheckBox
        checked={checked(item.cartId)}
        onChange={handleToggle(item.cartId)}
      />

      <div className={styles.item__info_box}>
        <Image src={item.imageUrl} alt="product" width="8rem" height="7rem" />

        <div className={styles.item__info}>
          <p>{item.title.replace(/(<b>|<\/b>)/g, '')}</p>
          <p>{item.size}</p>
          <p>{item.price.toLocaleString()}원</p>
        </div>
      </div>

      <div className={styles.item__quantity}>
        <QuantityController
          size={item.size}
          quantity={item.quantity}
          onIncrement={handleQuantityChange(item.cartId, item.quantity + 1)}
          onDecrement={handleQuantityChange(item.cartId, item.quantity - 1)}
        />
      </div>

      <div className={styles.item__price}>
        <p>{(item.price * item.quantity).toLocaleString()}원</p>
      </div>

      <div className={styles.item__buttons}>
        <Button text="주문하기" onClick={() => {}} />
        <Button
          text="삭제하기"
          onClick={handleDelete(item.cartId)}
          variant="white"
        />
      </div>
    </li>
  );
}

const MemorizedItem = memo(Item);

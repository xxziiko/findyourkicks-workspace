'use client';

import { ProductInfo } from '@/app/(checkout)/_features';
import type { CartItem } from '@/app/api/cart/route';
import { Button, CheckBox, NoData, QuantityController } from '@/components';
import type { QuantityHandlerType } from '@/lib/types';
import { ShoppingCartIcon } from 'lucide-react';
import { memo } from 'react';
import styles from './CartList.module.scss';

export type CartListProps = {
  cartItems: CartItem[];
  checkedItems: { [cartId: string]: boolean };
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & ItemHandlers;

interface HeaderProps {
  allChecked: boolean;
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ItemProps extends ItemHandlers {
  item: CartItem;
  checkedItems: { [cartId: string]: boolean };
}

type ItemHandlers = {
  onToggle: (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => void;
  onQuantityChange: QuantityHandlerType;
  onDelete: (id: string) => void;
  onNextStep: () => void;
};

export default function CartList(props: CartListProps) {
  const { cartItems, checkedItems, onToggleAll, ...rest } = props;

  const allChecked = cartItems.every((item) => checkedItems[item.cartItemId]);

  const headerProps = { allChecked, onToggleAll };
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
        <MemorizedItem key={item.cartItemId} {...itemProps} item={item} />
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
  checkedItems,
  onToggle,
  onQuantityChange,
  onDelete,
  onNextStep,
}: ItemProps) {
  return (
    <li className={styles.item}>
      <CheckBox
        checked={checkedItems[item.cartItemId]}
        onChange={(e) => onToggle(e, item.cartItemId)}
      />

      <button type="button" className={styles.item__info}>
        <ProductInfo item={item} type="cart" />
      </button>

      <div className={styles.item__quantity}>
        <QuantityController
          id={item.cartItemId}
          quantity={item.quantity}
          inventory={item.inventory}
          onQuantityChange={onQuantityChange}
        />
      </div>

      <div className={styles.item__price}>
        <p>{(Number(item.price) * item.quantity).toLocaleString()}원</p>
      </div>

      <div className={styles.item__buttons}>
        <Button text="주문하기" onClick={onNextStep} />
        <Button
          text="삭제하기"
          onClick={() => onDelete(item.cartItemId)}
          variant="lined--r"
        />
      </div>
    </li>
  );
}

const MemorizedItem = memo(Item);

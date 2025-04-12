import { OrderProducts } from '@/app/(order-flow)/_features';
import type { CartItem } from '@/app/api/cart/route';
import { Button, CheckBox, NoData, QuantityController } from '@/components';
import type { QuantityHandlerType } from '@/lib/types';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import styles from './CartList.module.scss';

export interface CartListProps extends ItemHandlers {
  cartItems: CartItem[];
  isAllChecked: boolean;
  isLoading: boolean;
  checkedItems: { [cartId: string]: boolean };
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ItemProps extends ItemHandlers {
  item: CartItem;
  isLoading: boolean;
  checkedItems: { [cartId: string]: boolean };
}

interface HeaderProps {
  isAllChecked: boolean;
  onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type ItemHandlers = {
  onToggle: (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => void;
  onQuantityChange: QuantityHandlerType;
  onDelete: (id: string) => void;
  onCreateOrderSheetForSingleProduct: (cartItemId: string) => void;
};

export default function CartList(props: CartListProps) {
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
        <MemorizedItem key={item.cartItemId} {...itemProps} item={item} />
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

function Item({
  item,
  isLoading,
  checkedItems,
  onToggle,
  onQuantityChange,
  onDelete,
  onCreateOrderSheetForSingleProduct,
}: ItemProps) {
  return (
    <li className={styles.item}>
      <CheckBox
        checked={checkedItems[item.cartItemId]}
        onChange={(e) => onToggle(e, item.cartItemId)}
      />

      <Link href={`/product/${item.productId}`} className={styles.item__info}>
        <OrderProducts
          item={{ ...item, size: item.selectedOption.size }}
          type="cart"
        />
      </Link>

      <div className={styles.item__quantity}>
        <QuantityController
          id={item.cartItemId}
          quantity={item.quantity}
          inventory={item.selectedOption}
          onQuantityChange={onQuantityChange}
        />
      </div>

      <div className={styles.item__price}>
        <p>{(Number(item.price) * item.quantity).toLocaleString()}원</p>
      </div>

      <div className={styles.item__buttons}>
        <Button
          text="주문하기"
          onClick={() => onCreateOrderSheetForSingleProduct(item.cartItemId)}
          isLoading={isLoading}
        />
        <Button
          text="삭제하기"
          onClick={() => onDelete(item.cartItemId)}
          variant="lined--r"
          isLoading={isLoading}
        />
      </div>
    </li>
  );
}

const MemorizedItem = memo(Item);

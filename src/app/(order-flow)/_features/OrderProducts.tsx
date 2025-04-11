import type { OrderSheetItem } from '@/app/api/checkout/[id]/route';
import { Image } from '@/components';
import styles from './OrderProducts.module.scss';

export type OrderProductsProps = {
  item: OrderSheetItem;
  type: 'checkout' | 'cart';
};

export default function OrderProducts({ item, type }: OrderProductsProps) {
  return (
    <div className={styles.info}>
      <Image src={item.image} alt="product" width="8rem" height="7rem" />

      <div className={styles.__inner}>
        <p>{item.title}</p>
        <p>{item.size}</p>
        <p>{item.price.toLocaleString()}원</p>
        {type === 'checkout' && <p>수량: {item.quantity}개</p>}
      </div>
    </div>
  );
}

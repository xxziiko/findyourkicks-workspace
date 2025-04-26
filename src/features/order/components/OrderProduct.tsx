import type { OrderProductItem } from '@/features/order-sheet/types';
import { Image } from '@/shared/components';
import styles from './OrderProduct.module.scss';

interface OrderProductProps {
  product: OrderProductItem;
  type: 'order' | 'cart';
}

export default function OrderProduct({ product, type }: OrderProductProps) {
  const { title, image, size, price, quantity } = product;

  return (
    <div className={styles.info}>
      <Image src={image} alt="product" width="8rem" height="7rem" />

      <div className={styles.__inner}>
        <p>{title}</p>
        <p>{size}</p>
        <p>{price.toLocaleString()}원</p>
        {type === 'order' && <p>수량: {quantity}개</p>}
      </div>
    </div>
  );
}

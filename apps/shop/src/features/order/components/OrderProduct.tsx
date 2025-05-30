import type { OrderProductItem } from '@/features/order';
import { ProductImage } from '@/features/product';
import styles from './OrderProduct.module.scss';

interface OrderProductProps {
  product: OrderProductItem;
  type: 'order' | 'cart';
}

export default function OrderProduct({ product, type }: OrderProductProps) {
  const { title, image, size, price, quantity } = product;

  return (
    <div className={styles.info}>
      <ProductImage src={image} alt="product" width="128px" height="128px" />

      <div className={styles.__inner}>
        <p>{title}</p>
        <p>{size}</p>
        <p>{price.toLocaleString()}원</p>
        {type === 'order' && <p>수량: {quantity}개</p>}
      </div>
    </div>
  );
}

import { Image } from '@/components';
import type { CartItem } from '@/lib/types';
import styles from './ProductInfo.module.scss';

export default function ProductInfo({
  item,
  type,
}: { item: CartItem; type: 'checkout' | 'cart' }) {
  return (
    <div className={styles.info}>
      <Image src={item.image} alt="product" width="8rem" height="7rem" />

      <div className={styles.__inner}>
        <p>{item.title.replace(/(<b>|<\/b>)/g, '')}</p>
        <p>{item.size}</p>
        <p>{item.price.toLocaleString()}원</p>
        {type === 'checkout' && <p>수량: {item.quantity}개</p>}
      </div>
    </div>
  );
}

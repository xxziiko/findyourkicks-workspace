'use client';

import { Button, CheckBox, Image, QuantityController } from '@/components';
import type { CartListItemProps } from '@/types/product';
import styles from './CartListItem.module.scss';

export default function CartListItem({ item, ...props }: CartListItemProps) {
  return (
    <li className={styles.item}>
      <CheckBox />

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
          {...props}
          size={item.size}
          quantity={item.quantity}
        />
      </div>

      <div className={styles.item__price}>
        <p>{(item.price * item.quantity).toLocaleString()}원</p>
      </div>

      <div className={styles.item__buttons}>
        <Button text="주문하기" onClick={() => {}} />
        <Button text="삭제하기" onClick={() => {}} variant="white" />
      </div>
    </li>
  );
}

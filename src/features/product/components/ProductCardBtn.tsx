import { Image } from '@/shared/components';
import React from 'react';
import styles from './ProductCardBtn.module.scss';

interface Card {
  src: string;
  brand: string;
  title: string;
  price: number;
}

const Card = ({ title, src, brand, price }: Card) => {
  return (
    <button type="button" className={styles.card}>
      <div className={styles.card__content}>
        <Image src={src} alt="product" width="13rem" height="13rem" />
        <div className={styles.card__details}>
          <p className={styles['card__details--brand']}>{brand}</p>
          <p>{title.replace(/(<b>|<\/b>)/g, '')}</p>
        </div>
      </div>

      <p className={styles.card__price}>{Number(price).toLocaleString()} 원</p>
    </button>
  );
};

export default React.memo(Card);

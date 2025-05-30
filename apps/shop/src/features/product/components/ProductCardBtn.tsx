import { ProductImage } from '@/features/product';
import React from 'react';
import styles from './ProductCardBtn.module.scss';

interface ProductCardBtnProps {
  src: string;
  brand: string;
  title: string;
  price: number;
  onAllImageLoad: () => void;
}

const ProductCardBtn = ({
  title,
  src,
  brand,
  price,
  onAllImageLoad,
}: ProductCardBtnProps) => {
  return (
    <button type="button" className={styles.card}>
      <div className={styles.card__content}>
        <ProductImage
          src={src}
          alt="product"
          priority
          onLoad={onAllImageLoad}
        />
        <div className={styles.card__details}>
          <p className={styles['card__details--brand']}>{brand}</p>
          <p>{title.replace(/(<b>|<\/b>)/g, '')}</p>
        </div>
      </div>

      <p className={styles.card__price}>{Number(price).toLocaleString()} 원</p>
    </button>
  );
};

export default React.memo(ProductCardBtn);

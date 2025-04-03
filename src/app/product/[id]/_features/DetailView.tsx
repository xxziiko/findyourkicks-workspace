'use client';

import { Button, Image } from '@/components';
import type { EventHandlers, InventoryItem, SelectedOption } from '@/lib/types';
import type { Detail } from './Detail';
import styles from './DetailView.module.scss';
import Option from './Option';

export type DetailViewProps = DetailViewBase & EventHandlers;

interface DetailViewBase {
  product: Detail;
  totalQuantity: number;
  selectedOptions: SelectedOption[];
  onCartButton: () => void;
  onDelete: (id: string) => void;
  getCurrentQuantity: (id: string) => number;
}

export default function DetailView(props: DetailViewProps) {
  const { product } = props;

  return (
    <article className={styles.detail}>
      <figure className={styles.image__box}>
        <Image src={product.image} alt="product" width="24rem" height="24rem" />
      </figure>

      <div className={styles.detail__divider} />

      <DetailView.Content {...props} />
    </article>
  );
}

DetailView.Content = Content;

function Content(props: DetailViewProps) {
  const {
    product,
    totalQuantity,
    selectedOptions,

    onSelectSize,
    onDelete,
    onQuantityChange,
    onCartButton,
    getCurrentQuantity,
  } = props;

  return (
    <section className={styles.content}>
      <div className={styles.content__top}>
        <div>
          <p className={styles['content__top_text--brand']}>{product.brand}</p>
          <p className={styles['content__top_text--price']}>
            {Number(product.price).toLocaleString()} 원
          </p>
        </div>

        <div>
          <p>{product.title}</p>
          <p
            className={styles['content__top_text--subtitle']}
          >{`${product.brand} > ${product.category}`}</p>

          <p className={styles.content__top_text}>{product.description}</p>
        </div>

        <div className={styles.content__top_options}>
          {product.inventory.map(({ size, stock }) => (
            <Button
              key={size}
              variant="lined"
              onClick={() => onSelectSize(size)}
              disabled={stock === getCurrentQuantity(size)}
              text={size}
            />
          ))}
        </div>

        <ul>
          {selectedOptions.map(({ size, quantity }) => (
            <Option
              key={size}
              size={size}
              quantity={quantity}
              price={product.price}
              inventory={product.inventory}
              onQuantityChange={onQuantityChange}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </div>

      <div className={styles.content__bottom}>
        <div className={styles.content__bottom_wrapper}>
          <p className={styles['content__bottom_wrapper--total']}>합계</p>
          <p className={styles['content__bottom_wrapper--price']}>
            {(totalQuantity * product.price).toLocaleString()}원
          </p>
        </div>

        <div className={styles.content__bottom_buttons}>
          <Button text="장바구니" onClick={onCartButton} />
          <Button text="구매하기" onClick={() => {}} variant="lined--r" />
        </div>
      </div>
    </section>
  );
}

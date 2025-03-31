'use client';

import { Button, Image } from '@/components';
import type {
  EventHandlers,
  InventoryItem,
  ProductItem,
  SelectedOption,
} from '@/lib/types';
import styles from './DetailView.module.scss';
import Option from './Option';

export type DetailViewProps = DetailViewBase & EventHandlers;

interface DetailViewBase {
  productDetail: ProductItem;
  price: number;
  inventory: InventoryItem[];
  totalQuantity: number;
  selectedOptions: SelectedOption[];
  onCartButton: () => void;
  onDelete: (id: string) => void;
}

export default function DetailView(props: DetailViewProps) {
  const { productDetail } = props;

  return (
    <article className={styles.detail}>
      <figure className={styles.image__box}>
        <Image
          src={productDetail.image}
          alt="product"
          width="24rem"
          height="24rem"
        />
      </figure>

      <div className={styles.detail__divider} />

      <DetailContent {...props} />
    </article>
  );
}

function DetailContent(props: DetailViewProps) {
  const {
    productDetail,
    price,
    inventory,
    totalQuantity,
    selectedOptions,

    onSelectSize,
    onDelete,
    onQuantityChange,
    onCartButton,
  } = props;

  return (
    <section className={styles.content}>
      <div className={styles.content__top}>
        <div>
          <p className={styles['content__top_text--brand']}>
            {productDetail.brand}
          </p>
          <p className={styles['content__top_text--price']}>
            {Number(productDetail.price).toLocaleString()} 원
          </p>
        </div>

        <div>
          <p>{productDetail.title.replace(/(<b>|<\/b>)/g, '')}</p>
          <p
            className={styles['content__top_text--subtitle']}
          >{`${productDetail.brand} > ${productDetail.category}`}</p>
        </div>

        <div className={styles.content__top_options}>
          {inventory.map(({ size, stock }) => (
            <Button
              key={size}
              variant="lined"
              onClick={() => onSelectSize(size)}
              disabled={!stock}
              text={size}
            />
          ))}
        </div>

        <ul>
          {selectedOptions.map(({ size, quantity }) => (
            <Option
              size={size}
              quantity={quantity}
              key={size}
              price={price}
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
            {(totalQuantity * price).toLocaleString()}원
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

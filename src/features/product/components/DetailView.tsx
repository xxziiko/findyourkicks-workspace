'use client';

import { Option } from '@/features/product';
import type { ProductDetail, SelectedOption } from '@/features/product/types';
import { Button, Image } from '@/shared/components';
import styles from './DetailView.module.scss';

interface DetailViewProps {
  productDetail: ProductDetail;
  totalQuantity: number;
  isMutatingCart: boolean;
  selectedOptions: SelectedOption[];
  onCartButton: () => void;
  onDelete: (id: string) => void;
  getCurrentQuantity: (id: string) => number;
  onSelectSize: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
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

      <Content {...props} />
    </article>
  );
}

function Content({
  productDetail,
  totalQuantity,
  selectedOptions,
  isMutatingCart,
  onSelectSize,
  onDelete,
  onQuantityChange,
  onCartButton,
  getCurrentQuantity,
}: DetailViewProps) {
  const { brand, price, title, description, inventory, category } =
    productDetail;

  return (
    <section className={styles.content}>
      <div className={styles.content__top}>
        <div>
          <p className={styles['content__top_text--brand']}>{brand}</p>
          <p className={styles['content__top_text--price']}>
            {Number(price).toLocaleString()} 원
          </p>
        </div>

        <div>
          <p>{title}</p>
          <p
            className={styles['content__top_text--subtitle']}
          >{`${brand} > ${category}`}</p>

          <p className={styles.content__top_text}>{description}</p>
        </div>

        <div className={styles.content__top_options}>
          {inventory.map(({ size, stock }) => (
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
              price={price}
              inventory={inventory}
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
          <Button
            text="장바구니"
            onClick={onCartButton}
            isLoading={isMutatingCart}
          />

          {/* <Button text="구매하기" onClick={onCartButton} /> */}
        </div>
      </div>
    </section>
  );
}

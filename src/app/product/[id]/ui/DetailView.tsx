import { Button, Image } from '@/components';
import type { DetailViewProps } from '../Detail';
import styles from './DetailView.module.scss';
import Option from './Option';

export default function DetailView(props: DetailViewProps) {
  const { productDetail } = props;

  return (
    <article className={styles.detail}>
      <Image
        src={productDetail.image}
        alt="product"
        width="24rem"
        height="24rem"
      />

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
    onIncrement,
    onDecrement,
    onCartButton,
  } = props;

  return (
    <section className={styles.detail__content}>
      <div>
        <p className={styles['detail__text--brand']}>{productDetail.maker}</p>
        <p className={styles['detail__text--price']}>
          {Number(productDetail.price).toLocaleString()} 원
        </p>
      </div>

      <div>
        <p>{productDetail.title.replace(/(<b>|<\/b>)/g, '')}</p>
        <p
          className={styles['detail__text--subtitle']}
        >{`${productDetail.brand} > ${productDetail.category}`}</p>
      </div>

      <div className={styles.detail__options}>
        {inventory.map(({ size, stock }) => (
          <Button
            key={size}
            variant="lined"
            onClick={onSelectSize(size)}
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
            onIncrement={onIncrement(size)}
            onDecrement={onDecrement(size)}
            onDelete={onDelete(size)}
          />
        ))}
      </ul>

      <div className={styles.detail__bottom}>
        <p className={styles['detail__bottom--total']}>합계</p>
        <p className={styles['detail__bottom--price']}>
          {(totalQuantity * price).toLocaleString()}원
        </p>
      </div>

      <div className={styles.detail__button_box}>
        <Button text="장바구니" onClick={onCartButton} />
        <Button text="구매하기" onClick={() => {}} variant="white" />
      </div>
    </section>
  );
}

import { Button, Image } from '@/components';
import type { DetailViewProps } from '../Detail';
import styles from './DetailView.module.scss';
import Option from './Option';

export default function DetailView(props: DetailViewProps) {
  const {
    item,
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
    <article className={styles.detail}>
      <Image src={item.image} alt="product" width="24rem" height="24rem" />

      <div className={styles.detail__divider} />

      <section className={styles.detail__content}>
        <div>
          <p className={styles['detail__text--brand']}>{item.maker}</p>
          <p className={styles['detail__text--price']}>
            {Number(item.lprice).toLocaleString()} 원
          </p>
        </div>

        <div>
          <p className="">{item.title.replace(/(<b>|<\/b>)/g, '')}</p>
          <p
            className={styles['detail__text--subtitle']}
          >{`${item.brand} > ${item.category4}`}</p>
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
              onDelete={onDelete}
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
    </article>
  );
}

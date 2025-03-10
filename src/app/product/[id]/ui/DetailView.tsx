import { Button } from '@/components';
import type { DetailViewProps } from '@/types/product';
import Image from 'next/image';
import styles from './DetailView.module.scss';
import Option from './Option';

export default function DetailView(props: DetailViewProps) {
  const {
    item,
    price,
    inventory,
    totalQuantity,
    selectedOptions,

    handleSelectSize,
    onDeleteButtonClick,
    onIncrementButtonClick,
    onDecrementButtonClick,
    handleCartButton,
  } = props;

  return (
    <article className={styles.detail}>
      <figure className={styles.detail__image}>
        <Image src={item.image} alt="product" fill sizes="100%" />
      </figure>

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
              variant="size"
              onClick={() => handleSelectSize(size)}
              disabled={!stock}
              text={size}
            />
          ))}
        </div>

        <div>
          <ul>
            {selectedOptions.map(({ size, quantity }) => (
              <Option
                size={size}
                quantity={quantity}
                key={size}
                price={price}
                onIncrementButtonClick={onIncrementButtonClick}
                onDecrementButtonClick={onDecrementButtonClick}
                onDeleteButtonClick={onDeleteButtonClick}
              />
            ))}
          </ul>

          <div>
            <div className="flex justify-between py-6">
              <p className="font-semibold text-sm">합계</p>
              <p className="font-bold text-2xl">
                {(totalQuantity * price).toLocaleString()}원
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button text="장바구니" onClick={handleCartButton} />
              <Button text="구매하기" onClick={() => {}} variant="white" />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

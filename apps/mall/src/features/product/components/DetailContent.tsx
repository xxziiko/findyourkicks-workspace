'use client';

import {
  useProductOption,
  Description,
  useProductsIntoCart,
  OptionList,
} from '@/features/product';
import type { ProductDetail } from '@/features/product/types';
import { Button } from '@/shared/components';
import styles from './DetailContent.module.scss';
import { useRouter } from 'next/navigation';
import { useUser } from '@/features/user/hooks';

export default function DetailContent({
  productDetail,
}: {
  productDetail: ProductDetail;
}) {
  const {
    selectedOptions,
    totalQuantity,
    optionPayload,
    handleSelectSize,
    handleDeleteButton,
    handleQuantityChange,
    resetOptions,
    isOutOfStock,
  } = useProductOption({ productDetail });

  const { handleCartButton, isMutatingCart } = useProductsIntoCart({
    optionPayload,
    resetOptions,
  });

  const { isAuthenticated } = useUser();
  const router = useRouter();

  const { brand, price, title, description, inventory, category } =
    productDetail;

  return (
    <section className={styles.content}>
      <div className={styles.content__top}>
        <Description
          brand={brand}
          price={price}
          title={title}
          description={description}
          category={category}
        />

        <OptionButtons>
          {inventory.map(({ size, stock }) => (
            <Button
              key={size}
              variant="lined"
              onClick={() => handleSelectSize(size)}
              disabled={isOutOfStock({ stock, selectedSize: size })}
              text={size}
            />
          ))}
        </OptionButtons>
      </div>

      <OptionList
        selectedOptions={selectedOptions}
        onQuantityChange={handleQuantityChange}
        onDelete={handleDeleteButton}
        price={price}
        inventory={inventory}
      />

      <div className={styles.content__bottom}>
        <div className={styles.content__wrapper}>
          <p className={styles['content__wrapper--total']}>합계</p>
          <p className={styles['content__wrapper--price']}>
            {(totalQuantity * price).toLocaleString()}원
          </p>
        </div>

        <div className={styles.content__buttons}>
          <Button
            text="장바구니"
            onClick={
              isAuthenticated ? handleCartButton : () => router.push('/login')
            }
            isLoading={isMutatingCart}
          />
        </div>
      </div>
    </section>
  );
}

function OptionButtons({ children }: { children: React.ReactNode }) {
  return <div className={styles.options}>{children}</div>;
}

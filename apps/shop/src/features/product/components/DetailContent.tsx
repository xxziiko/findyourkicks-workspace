'use client';

import { cartQueries, useCartItemMutation } from '@/features/cart';
import { Description, OptionList, useProductOption } from '@/features/product';
import type { ProductDetail } from '@/features/product/types';
import { useUser } from '@/features/user/hooks';
import { PATH } from '@/shared/constants';
import { Button } from '@findyourkicks/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import styles from './DetailContent.module.scss';

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

  const { brand, price, title, description, inventory, category } =
    productDetail;

  const queryClient = useQueryClient();
  const { mutate: mutateCart, isPending: isMutatingCart } =
    useCartItemMutation();

  const { isAuthenticated } = useUser();
  const router = useRouter();

  const handleCartButton = () => {
    mutateCart(optionPayload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: cartQueries.list().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: cartQueries.count().queryKey,
        });
        resetOptions();
      },
    });
  };

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
              variant="secondary"
              onClick={() => handleSelectSize(size)}
              disabled={isOutOfStock({ stock, selectedSize: size })}
            >
              {size}
            </Button>
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
            onClick={
              isAuthenticated ? handleCartButton : () => router.push(PATH.login)
            }
            isLoading={isMutatingCart}
            radius
          >
            장바구니
          </Button>
        </div>
      </div>
    </section>
  );
}

function OptionButtons({ children }: { children: React.ReactNode }) {
  return <div className={styles.options}>{children}</div>;
}

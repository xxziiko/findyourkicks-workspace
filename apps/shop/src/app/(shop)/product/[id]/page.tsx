import { DetailContent, fetchProductById } from '@/features/product';
import { ProductImage } from '@/features/product';
import { Suspense } from 'react';
import Loading from './loading';
import styles from './page.module.scss';

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productDetail = await fetchProductById(id);

  return (
    <Suspense fallback={<Loading />}>
      <article className={styles.detail}>
        <figure className={styles.image__box}>
          <ProductImage
            src={productDetail.image}
            alt="product"
            width="24rem"
            height="24rem"
          />
        </figure>

        <div className={styles.detail__divider} />

        <DetailContent productDetail={productDetail} />
      </article>
    </Suspense>
  );
}

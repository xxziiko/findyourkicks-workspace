'use client';
import {
  ProductCardBtn,
  ProductListLoading,
  useProductList,
} from '@/features/product';
import type { ProductItem } from '@/features/product/types';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ImpressionArea } from 'react-simplikit';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './ProductList.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';

const BANNERS = [
  {
    src: '/images/banner1.webp',
    alt: 'banner',
  },
  {
    src: '/images/banner2.webp',
    alt: 'banner',
  },
  {
    src: '/images/banner3.webp',
    alt: 'banner',
  },
] as const;

interface ProductListProps {
  products: {
    initialProducts: ProductItem[];
    productsByVans: ProductItem[];
    productsByNike: ProductItem[];
  };
}

export default function ProductList({ products }: ProductListProps) {
  const { initialProducts, productsByVans, productsByNike } = products;
  const { allLoaded, onAllImageLoad, onFetchNextPage, productList } =
    useProductList({
      initialValues: initialProducts,
    });

  const sections = [
    {
      title: '언제 어디서나 함께, 반스 시리즈',
      products: productsByVans,
    },
    {
      title: 'Just Do It, Nike 시리즈',
      products: productsByNike,
    },
    {
      title: '모든 신발 둘러보기',
      products: productList,
    },
  ] as const;

  return (
    <>
      {!allLoaded && <ProductListLoading />}
      <section className={styles.banner}>
        <Swiper
          className={styles.swiper}
          slidesPerView={1}
          loop={true}
          modules={[Autoplay]}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {BANNERS.map(({ src, alt }) => (
            <SwiperSlide className={styles.swiper__slide} key={src}>
              <Image
                src={src}
                layout="responsive"
                alt={alt}
                width={1216}
                height={500}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {sections.map(({ title, products }) => (
        <Section
          key={title}
          title={title}
          products={products}
          onAllImageLoad={onAllImageLoad}
        />
      ))}

      {/* TODO: 직접 구현 */}
      <ImpressionArea
        onImpressionStart={onFetchNextPage}
        areaThreshold={0.2}
        className={styles.loading}
      >
        <Loader className={styles.loading__loader} />
      </ImpressionArea>
    </>
  );
}

function Section({
  title,
  products,
  onAllImageLoad,
}: { title: string; products: ProductItem[]; onAllImageLoad: () => void }) {
  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <section className={styles.list}>
        {products.map(({ productId, image, brand, title, price }) => (
          <Link href={`/product/${productId}`} key={productId}>
            <ProductCardBtn
              src={image}
              brand={brand}
              title={title}
              price={price}
              onAllImageLoad={onAllImageLoad}
            />
          </Link>
        ))}
      </section>
    </>
  );
}

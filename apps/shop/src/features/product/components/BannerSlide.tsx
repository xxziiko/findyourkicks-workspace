'use client';

import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './BannerSlide.module.scss';

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

export function BannerSlide() {
  return (
    <Swiper
      className={styles.swiper}
      slidesPerView={1}
      loop={true}
      modules={[Autoplay, Pagination]}
      centeredSlides={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={true}
    >
      {BANNERS.map(({ src, alt }) => (
        <SwiperSlide className={styles.swiper__slide} key={src}>
          <img src={src} alt={alt} width={1216} height={500} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

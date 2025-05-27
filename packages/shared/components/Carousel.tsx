'use client';

import { CircleXIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './Carousel.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  images: string[];
  onClose: () => void;
  isOpen: boolean;
}
export function Carousel({ images, onClose, isOpen }: CarouselProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    isOpen && (
      <div className={styles.background}>
        <div className={styles.button}>
          <button type="button" onClick={onClose}>
            <CircleXIcon width={40} height={40} color="white" />
          </button>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            className={styles.swiper}
            slidesPerView={1}
            modules={[Pagination, Navigation]}
            centeredSlides={true}
            pagination={true}
            navigation={true}
          >
            {images.map((image) => (
              <SwiperSlide key={image} className={styles.swiperSlide}>
                <img src={image} alt="carousel" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    )
  );
}

import { CircleXIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './Carousel.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';

interface CarouselProps {
  images: string[];
  onClose: () => void;
}
export function Carousel({ images, onClose }: CarouselProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.button}>
        <button type="button" onClick={onClose}>
          <CircleXIcon width={40} height={40} color="white" />
        </button>
      </div>
      <Swiper
        className={styles.swiper}
        slidesPerView={1}
        modules={[Pagination, Navigation]}
        pagination={true}
        navigation={true}
      >
        {images.map((image) => (
          <SwiperSlide key={image} className={styles.swiperSlide}>
            <img src={image} alt="carousel" width={100} height={100} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

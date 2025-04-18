'use client';

import { CardSkeleton } from '@/shared/components';
import useImagesLoaded from '@/shared/hooks/useImagesLoaded';
import Image from 'next/image';
import { memo } from 'react';
import styles from './Image.module.scss';
interface ImageComponentProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  onAllImageLoad?: () => void;
}

const ImageComponent = ({
  width,
  height,
  onAllImageLoad = () => {},
  ...props
}: ImageComponentProps) => {
  const { allLoaded, handleImageLoad } = useImagesLoaded(1);

  return (
    <>
      {!allLoaded && <CardSkeleton />}
      <figure className={styles.image} style={{ width, height }}>
        <Image
          {...props}
          fill
          sizes="100%"
          onLoad={() => {
            handleImageLoad();
            onAllImageLoad();
          }}
          priority
        />
      </figure>
    </>
  );
};

export default memo(ImageComponent);

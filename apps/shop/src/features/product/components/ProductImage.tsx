'use client';

import Image from 'next/image';
import { memo } from 'react';
import styles from './ProductImage.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  onLoad?: () => void;
  priority?: boolean;
}

const ProductImage = ({ width, height, ...props }: ProductImageProps) => {
  return (
    <figure className={styles.image} style={{ width, height }}>
      <Image {...props} fill sizes="100%" />
    </figure>
  );
};

export default memo(ProductImage);

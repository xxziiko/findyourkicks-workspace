'use client';

import Image from 'next/image';
import { memo } from 'react';
import styles from './Image.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

interface ImageComponentProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  onLoad?: () => void;
  priority?: boolean;
}

const ImageComponent = ({ width, height, ...props }: ImageComponentProps) => {
  return (
    <>
      <figure className={styles.image} style={{ width, height }}>
        <Image {...props} fill sizes="100%" />
      </figure>
    </>
  );
};

export default memo(ImageComponent);

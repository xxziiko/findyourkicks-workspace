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
  onAllImageLoad?: () => void;
}

const ImageComponent = ({
  width,
  height,
  onAllImageLoad = () => {},
  ...props
}: ImageComponentProps) => {
  return (
    <>
      <figure className={styles.image} style={{ width, height }}>
        <Image {...props} fill sizes="100%" onLoad={onAllImageLoad} priority />
      </figure>
    </>
  );
};

export default memo(ImageComponent);

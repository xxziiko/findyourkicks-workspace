import Image from 'next/image';
import { memo } from 'react';
import styles from './Image.module.scss';

interface ImageComponentProps {
  src: string;
  alt: string;
  width: string;
  height: string;
}

const ImageComponent = ({ width, height, ...props }: ImageComponentProps) => {
  return (
    <figure className={styles.image} style={{ width, height }}>
      <Image {...props} fill sizes="100%" />
    </figure>
  );
};

export default memo(ImageComponent);

import { CardSection } from '@/shared/components';
import { ImageUploadInput } from '@findyourkicks/shared';
import type { ChangeEvent, ReactNode } from 'react';
import styles from './ProductImageUploader.module.scss';

const MAX_IMAGE_COUNT = 1;

interface ProductImageUploaderProps {
  previews: string[];
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  ErrorMessage: ReactNode;
}

export function ProductImageUploader({
  previews,
  ErrorMessage,
  onInputChange,
}: ProductImageUploaderProps) {
  return (
    <CardSection title="상품 이미지">
      <p className={styles.description}>
        상품 이미지를 추가해주세요. <br /> 최대 {MAX_IMAGE_COUNT}개까지 추가할
        수 있습니다.
      </p>

      {ErrorMessage}

      <ImageUploadInput
        maxCount={MAX_IMAGE_COUNT}
        previews={previews}
        onChange={onInputChange}
      />
    </CardSection>
  );
}

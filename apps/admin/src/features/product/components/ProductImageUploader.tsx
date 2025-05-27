import { CardSection } from '@/shared/components';
import { ImageUploadInput } from '@findyourkicks/shared';
import styles from './ProductImageUploader.module.scss';

const MAX_IMAGE_COUNT = 1;

interface ProductImageUploaderProps {
  previews: string[];
  handlePreviews: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductImageUploader({
  previews,
  handlePreviews,
}: ProductImageUploaderProps) {
  return (
    <CardSection title="상품 이미지">
      <p className={styles.description}>
        상품 이미지를 추가해주세요. <br /> 최대 {MAX_IMAGE_COUNT}개까지 추가할
        수 있습니다.
      </p>
      <ImageUploadInput
        maxCount={MAX_IMAGE_COUNT}
        previews={previews}
        onChange={handlePreviews}
      />
    </CardSection>
  );
}

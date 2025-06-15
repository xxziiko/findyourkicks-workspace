import type { ProductRegisterForm } from '@/features/product';
import { CardSection, ErrorMessage } from '@/shared/components';
import { ImageUploader } from '@findyourkicks/shared';
import type { FieldErrors } from 'react-hook-form';
import styles from './ProductImageFormSection.module.scss';

const MAX_IMAGE_COUNT = 1;

interface ProductImageFormSectionProps {
  errors: FieldErrors<ProductRegisterForm>;
  previews: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductImageFormSection({
  errors,
  previews,
  onInputChange,
}: ProductImageFormSectionProps) {
  return (
    <CardSection title="상품 이미지">
      <p className={styles.description}>
        상품 이미지를 추가해주세요. <br /> 최대 {MAX_IMAGE_COUNT}개까지 추가할
        수 있습니다.
      </p>

      {errors.images && (
        <ErrorMessage id="images" error={errors.images?.message} />
      )}

      <ImageUploader
        maxCount={MAX_IMAGE_COUNT}
        previews={previews}
        onChange={onInputChange}
      />
    </CardSection>
  );
}

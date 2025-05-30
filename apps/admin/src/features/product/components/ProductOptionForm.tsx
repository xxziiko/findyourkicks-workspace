import { OptionSizeTable, type Product } from '@/features/product';
import { CardSection, InputWithUnit } from '@/shared/components';
import { SIZES } from '@/shared/constants';
import { Button } from '@findyourkicks/shared';
import type { FieldErrors } from 'react-hook-form';
import styles from './ProductOptionForm.module.scss';

interface ProductOptionFormProps {
  errors: FieldErrors<Product>;
  sizes: { size: string; stock: number }[];
  onSelectAllSizes: () => void;
  onApplyAllStock: (stock: number) => void;
  onUpdateSizes: (size: string) => void;
  onChangeSizes: (size: string, stock: number) => void;
  onDeleteSize: (size: string) => void;
}

export function ProductOptionForm({
  sizes,
  errors,
  onSelectAllSizes,
  onApplyAllStock,
  onUpdateSizes,
  onChangeSizes,
  onDeleteSize,
}: ProductOptionFormProps) {
  const optionButtonText =
    sizes.length === SIZES.length ? '전체 선택 해제' : '전체 선택';

  return (
    <CardSection title="옵션">
      <div className={styles.size}>
        <div>
          <p className={styles.sizeTitle}>사이즈</p>
          <p className={styles.description}>
            등록할 사이즈 옵션을 선택해주세요.
          </p>
        </div>

        <div className={styles.sizeButtons}>
          <Button type="button" onClick={onSelectAllSizes}>
            {optionButtonText}
          </Button>
          {SIZES.map((size) => (
            <Button
              key={size}
              variant="secondary"
              type="button"
              onClick={() => onUpdateSizes(size)}
              disabled={sizes.some((s) => s.size === size)}
            >
              {size}
            </Button>
          ))}
        </div>

        {/* 선택한 옵션 테이블 - 재고 일괄 적용 또는 개별 적용 */}
        {sizes.length > 0 && (
          <>
            <CardSection.ListItem subTitle="재고 일괄 적용">
              <div className={styles.stockInput}>
                <InputWithUnit
                  aria-label="stock-input"
                  id="stock"
                  placeholder="숫자만 입력해주세요."
                  unit="개"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onApplyAllStock(Number(e.target.value))
                  }
                />
              </div>
            </CardSection.ListItem>

            <OptionSizeTable
              selectedSizes={sizes}
              onChange={onChangeSizes}
              onDelete={onDeleteSize}
            />
          </>
        )}

        {errors.sizes && (
          <p className={styles.error}>{errors.sizes?.message}</p>
        )}
      </div>
    </CardSection>
  );
}

import {
  OptionSizeTable,
  type Product,
  useProductSizeOptions,
} from '@/features/product';
import { CardSection, ErrorMessage, InputWithUnit } from '@/shared/components';
import { SIZES } from '@/shared/constants';
import { Button } from '@findyourkicks/shared';
import type { ChangeEvent } from 'react';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import styles from './ProductOptionForm.module.scss';

interface ProductOptionFormProps {
  errors: FieldErrors<Product>;
  control: Control<Product>;
}

export function ProductOptionForm({ errors, control }: ProductOptionFormProps) {
  const {
    isAllSelected,
    handleAllStockChange,
    handleAddSizeOption,
    handleToggleAllSizes,
    handleSizeChange,
    handleRemoveSizeOption,
  } = useProductSizeOptions();

  return (
    <CardSection title="옵션">
      <Controller
        control={control}
        name="sizes"
        render={({ field }) => (
          <div className={styles.size}>
            <div>
              <p className={styles.sizeTitle}>사이즈</p>
              <p className={styles.description}>
                등록할 사이즈 옵션을 선택해주세요.
              </p>
            </div>

            {errors.sizes && (
              <ErrorMessage id="sizes" error={errors.sizes?.message} />
            )}

            <div className={styles.sizeButtons}>
              <Button type="button" onClick={() => handleToggleAllSizes(field)}>
                {isAllSelected(field) ? '전체 선택 해제' : '전체 선택'}
              </Button>

              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant="secondary"
                  type="button"
                  onClick={() => handleAddSizeOption(size, field)}
                  disabled={
                    Array.isArray(field.value) &&
                    field.value.some((s: { size: string }) => s.size === size)
                  }
                >
                  {size}
                </Button>
              ))}
            </div>

            {/* 선택한 옵션 테이블 - 재고 일괄 적용 또는 개별 적용 */}
            {field.value.length > 0 && (
              <>
                <CardSection.ListItem subTitle="재고 일괄 적용">
                  <div className={styles.stockInput}>
                    <InputWithUnit
                      id="all-stock-input"
                      placeholder="숫자만 입력해주세요."
                      unit="개"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleAllStockChange(e, field)
                      }
                    />
                  </div>
                </CardSection.ListItem>

                <OptionSizeTable
                  sizes={field.value}
                  onChange={(size, stock) =>
                    handleSizeChange(size, stock, field)
                  }
                  onDelete={(size) => handleRemoveSizeOption(size, field)}
                />
              </>
            )}
          </div>
        )}
      />
    </CardSection>
  );
}

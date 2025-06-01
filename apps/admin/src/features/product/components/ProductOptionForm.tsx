import { OptionSizeTable } from '@/features/product';
import { CardSection, InputWithUnit } from '@/shared/components';
import { SIZES } from '@/shared/constants';
import { Button } from '@findyourkicks/shared';
import type { MouseEvent, ReactNode } from 'react';
import styles from './ProductOptionForm.module.scss';

interface ProductOptionFormProps {
  ErrorMessage: ReactNode;
  sizes: { size: string; stock: number }[];
  onAllSizesClick: (e: MouseEvent<Element>) => void;
  onAllStockChange: (stock: number) => void;
  onSizeClick: (size: string) => void;
  onSizesChange: (size: string, stock: number) => void;
  onSizeDelete: (size: string) => void;
}

export function ProductOptionForm({
  sizes,
  ErrorMessage,
  onAllSizesClick,
  onSizeClick,
  onSizesChange,
  onSizeDelete,
  onAllStockChange,
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

        {ErrorMessage}

        <div className={styles.sizeButtons}>
          <Button type="button" onClick={onAllSizesClick}>
            {optionButtonText}
          </Button>
          {SIZES.map((size) => (
            <Button
              key={size}
              variant="secondary"
              type="button"
              onClick={() => onSizeClick(size)}
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
                    onAllStockChange(Number(e.target.value))
                  }
                />
              </div>
            </CardSection.ListItem>

            <OptionSizeTable
              selectedSizes={sizes}
              onChange={onSizesChange}
              onDelete={onSizeDelete}
            />
          </>
        )}
      </div>
    </CardSection>
  );
}

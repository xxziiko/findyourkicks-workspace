import { OptionSizeTable, useOptionSize } from '@/features/product';
import { CardSection, InputWithUnit } from '@/shared/components';
import { SIZES } from '@/shared/constants';
import { Button } from '@findyourkicks/shared';
import styles from './ProductOptionForm.module.scss';

export function ProductOptionForm() {
  const {
    selectedSizes,
    handleSelectAllSizes,
    handleApplyAllStock,
    updateSelectedSizes,
    handleChangeSelectedSizes,
    deleteSelectedSize,
  } = useOptionSize();
  const optionButtonText =
    selectedSizes.length === SIZES.length ? '전체 선택 해제' : '전체 선택';

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
          <Button type="button" onClick={handleSelectAllSizes}>
            {optionButtonText}
          </Button>
          {SIZES.map((size) => (
            <Button
              key={size}
              variant="secondary"
              type="button"
              onClick={() => updateSelectedSizes(size)}
              disabled={selectedSizes.some((s) => s.size === size)}
            >
              {size}
            </Button>
          ))}
        </div>

        {/* 선택한 옵션 테이블 - 재고 일괄 적용 또는 개별 적용 */}
        {selectedSizes.length > 0 && (
          <>
            <CardSection.ListItem subTitle="재고 일괄 적용">
              <div className={styles.stockInput}>
                <InputWithUnit
                  id="stock"
                  placeholder="숫자만 입력해주세요."
                  unit="개"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleApplyAllStock(Number(e.target.value))
                  }
                />
              </div>
            </CardSection.ListItem>

            <OptionSizeTable
              selectedSizes={selectedSizes}
              onChange={handleChangeSelectedSizes}
              onDelete={deleteSelectedSize}
            />
          </>
        )}
      </div>
    </CardSection>
  );
}

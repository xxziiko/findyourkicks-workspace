import { CardSection, InputWithUnit } from '@/shared';
import { Button, Dropdown } from '@findyourkicks/shared';
import { useState } from 'react';
import styles from './ProductRegister.module.scss';

const FORM_LIST_FIELDS = [
  {
    title: '카테고리',
    options: ['운동화'],
  },
  {
    title: '브랜드',
    options: ['nike', 'vans', 'converse', 'new balance', 'adidas', 'puma'],
  },
] as const;

const FORM_FIELDS = [
  {
    id: 'productName',
    title: '상품명',
    placeholder: '상품명을 입력해주세요.',
    unit: '',
  },
  {
    id: 'price',
    title: '판매가',
    placeholder: '숫자만 입력해주세요.',
    unit: '원',
  },

  {
    id: 'detail',
    title: '상품 상세 정보',
    placeholder: '상품 상세 정보를 입력해주세요.',
    unit: '',
  },
  // {
  //   id: 'stock',
  //   title: '재고수량',
  //   placeholder: '숫자만 입력해주세요',
  //   unit: '개',
  // },
];

const SIZES = [
  '190',
  '200',
  '210',
  '220',
  '230',
  '240',
  '250',
  '260',
  '270',
  '280',
  '290',
  '300',
  '310',
  '320',
  '330',
] as const;

export default function ProductRegister() {
  const [selectedSizes, setSelectedSizes] = useState<
    {
      size: string;
      stock: number;
    }[]
  >([]);

  return (
    <form>
      <div className={styles.container}>
        <CardSection title="카테고리">
          {FORM_LIST_FIELDS.map(({ title, options }) => (
            <CardSection.ListItem subTitle={title} key={title}>
              <Dropdown
                variant="border"
                selected={title}
                setSelected={() => {}}
              >
                <Dropdown.Trigger />
                <Dropdown.Menu>
                  {options.map((option) => (
                    <Dropdown.Item key={option} text={option} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </CardSection.ListItem>
          ))}
        </CardSection>

        {FORM_FIELDS.map(({ id, title, placeholder, unit }) => (
          <CardSection title={title} key={id}>
            <InputWithUnit id={id} placeholder={placeholder} unit={unit} />
          </CardSection>
        ))}

        <CardSection title="옵션">
          <div className={styles.size}>
            <div>
              <p className={styles.sizeTitle}>사이즈</p>
              <p className={styles.sizeDescription}>
                등록할 사이즈 옵션을 선택해주세요.
              </p>
            </div>
            <div className={styles.sizeButtons}>
              {SIZES.map((size) => (
                <Button key={size} variant="secondary" type="button">
                  {size}
                </Button>
              ))}
            </div>

            {selectedSizes.length > 0 && (
              <div className={styles.sizeTable}>
                <p>재고 일괄 적용</p>
                <InputWithUnit
                  id="stock"
                  placeholder="숫자만 입력해주세요."
                  unit="개"
                  type="number"
                />
                <div className={styles.sizeTable__items}>
                  {selectedSizes.map(({ size }) => (
                    <p key={size}>{size}</p>
                  ))}
                </div>
              </div>
            )}

            <Button type="button" disabled>
              옵션 적용
            </Button>

            {/* 선택한 옵션 테이블 - 재고 일괄 적용 또는 개별 적용 */}
            {selectedSizes.length > 0 && (
              <SizeTable selectedSizes={selectedSizes} />
            )}
          </div>
        </CardSection>

        <CardSection title="상품 이미지">
          <div>{/* image upload */}</div>
          <input type="file" />

          {/* 이미지 미리보기 */}
          {/* 클릭 시 캐러셀 */}
        </CardSection>
      </div>

      <div className={styles.buttons}>
        <Button type="button" variant="secondary">
          임시저장
        </Button>
        <Button type="submit" variant="primary">
          등록하기
        </Button>
        <Button type="button" variant="secondary">
          취소
        </Button>
      </div>
    </form>
  );
}

function SizeTable({
  selectedSizes,
}: { selectedSizes: { size: string; stock: number }[] }) {
  return (
    <div className={styles.sizeTable}>
      <div className={styles.sizeHeader}>
        <p>사이즈</p>
        <p>재고</p>
      </div>
      {selectedSizes.map(({ size, stock }) => (
        <SizeItem size={size} stock={stock} key={size} />
      ))}
    </div>
  );
}

function SizeItem({ size, stock }: { size: string; stock: number }) {
  return (
    <div className={styles.sizeItem}>
      <p>{size}</p>
      <InputWithUnit
        id="stock"
        placeholder="숫자만 입력해주세요."
        unit="개"
        type="number"
        value={stock}
      />
    </div>
  );
}

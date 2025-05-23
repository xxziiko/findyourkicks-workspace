import { CardSection, InputWithUnit } from '@/shared';
import { Button } from '@findyourkicks/shared';
import styles from './ProductRegister.module.scss';

const FORM_LIST_FIELDS = ['카테고리', '브랜드'] as const;

const FORM_FIELDS = [
  {
    id: 'productName',
    title: '상품명',
    placeholder: '상품명을 입력해주세요.',
  },
  {
    id: 'price',
    title: '판매가',
    placeholder: '숫자만 입력해주세요',
    unit: '원',
  },
  {
    id: 'stock',
    title: '재고수량',
    placeholder: '숫자만 입력해주세요',
    unit: '개',
  },
  {
    id: 'detail',
    title: '상품 상세 정보',
    placeholder: '상품 상세 정보를 입력해주세요.',
  },
];

export default function ProductRegister() {
  return (
    <form>
      <div className={styles.container}>
        <CardSection title="카테고리">
          {FORM_LIST_FIELDS.map((subTitle) => (
            <CardSection.ListItem subTitle={subTitle} key={subTitle}>
              <div>{/* select */}</div>
            </CardSection.ListItem>
          ))}
        </CardSection>

        {FORM_FIELDS.map(({ id, title, placeholder, unit }) => (
          <CardSection title={title} key={id}>
            <InputWithUnit id={id} placeholder={placeholder} unit={unit} />
          </CardSection>
        ))}

        <CardSection title="옵션">
          <span>사이즈</span>
          {/* size buttons */}
        </CardSection>

        <CardSection title="상품 이미지">
          <div>{/* image upload */}</div>
          <input type="file" />
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

import { CheckBox } from '@/components';
import { CardLayout } from '@/components/layouts';

import { useCheckBoxGroup } from '@/components/checkbox/useCheckboxGrop';
import styles from './OrderCard.module.scss';

interface OrderCardProps {
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
  type: '주문' | '결제';
}

export default function OrderCard({
  totalPrice,
  totalPriceWithDeliveryFee,
  type,
}: OrderCardProps) {
  return (
    <CardLayout title={`${type} 정보`} type="primary">
      <div className={styles.inner}>
        <div className={styles.inner__item}>
          <p>총 상품 금액</p>
          <p>{totalPrice.toLocaleString()}원</p>
        </div>

        <div className={styles.inner__item}>
          <p>총 배송비</p>
          <p>3,000원</p>
        </div>
      </div>

      <div>
        <div className={styles.inner__total_price}>
          <p>총 결제금액</p>
          <p>{totalPriceWithDeliveryFee.toLocaleString()}원</p>
        </div>

        {type === '결제' && <AgreementSection />}
      </div>
    </CardLayout>
  );
}

const AGREEMENT_TEXT = [
  '(필수) 개인정보 수집/이용 동의',
  '(필수) 개인정보 제 3자 제공 동의',
  '(필수) 결제대행 서비스 이용약관',
];

function AgreementSection() {
  const { allChecked, checkedItems, handleToggleAll, handleToggle } =
    useCheckBoxGroup(AGREEMENT_TEXT, false);

  return (
    <div className={styles.agreement}>
      <div className={styles.agreement__item}>
        <CheckBox onChange={handleToggleAll} checked={allChecked} />
        <h4>주문 동의 및 개인정보 수집 이용 동의</h4>
      </div>

      {AGREEMENT_TEXT.map((item) => (
        <div className={styles.agreement__item} key={item}>
          <CheckBox
            onChange={(e) => handleToggle(e, item)}
            checked={checkedItems[item]}
          />
          <div>
            <p>{item}</p>
            <p>보기</p>
          </div>
        </div>
      ))}
    </div>
  );
}

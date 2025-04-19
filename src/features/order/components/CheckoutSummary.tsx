'use client';

import { CheckBox } from '@/shared/components';
import { useCheckBoxGroup } from '@/shared/components/checkbox/useCheckboxGrop';
import { CardLayout } from '@/shared/components/layouts';
import { useCheckoutAgreement } from '@/shared/hooks';
import { useEffect } from 'react';
import styles from './CheckoutSummary.module.scss';

interface CheckoutSummaryProps {
  totalPrice: number;
  totalPriceWithDeliveryFee: number;
  type: '주문' | '결제';
}

export default function CheckoutSummary({
  totalPrice,
  totalPriceWithDeliveryFee,
  type,
}: CheckoutSummaryProps) {
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
  const { isAllChecked, checkedItems, handleToggleAll, handleToggle } =
    useCheckBoxGroup(AGREEMENT_TEXT, false);
  const { setIsAllCheckedAgreement } = useCheckoutAgreement();

  useEffect(() => {
    setIsAllCheckedAgreement(isAllChecked);
  }, [isAllChecked, setIsAllCheckedAgreement]);

  return (
    <div className={styles.agreement}>
      <div className={styles.agreement__item}>
        <CheckBox onChange={handleToggleAll} checked={isAllChecked} />
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

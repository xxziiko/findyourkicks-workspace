'use client';
import { Button } from '@/components';
import styles from './DeliveryForm.module.scss';
import useDeliveryForm from './useDeliveryForm';

const FORM_TITLE = ['주문자 명', '연락처', '배송지 명'];
const FORM_PLACEHOLDER = [
  '받으실 분의 이름을 입력해주세요.',
  ' - 없이 휴대폰 번호를 입력해주세요.',
  '배송받을 주소의 이름을 입력해주세요.',
];

declare global {
  interface Window {
    daum: any;
  }
}

export default function DeliveryForm() {
  const { address, handlePostcode } = useDeliveryForm();

  return (
    <form className={styles.form}>
      <div className={styles.form__wrapper}>
        {FORM_TITLE.map((title, i) => (
          <div className={styles.form__inner} key={title}>
            <p>{title}</p>
            <input placeholder={FORM_PLACEHOLDER[i]} />
          </div>
        ))}
      </div>

      <div className={styles.form__wrapper}>
        <h5>주소 검색</h5>
        <div className={styles.form__address}>
          <input value={address.zonecode} readOnly />
          <Button
            text="우편번호 찾기"
            variant="lined--r"
            onClick={handlePostcode}
          />
        </div>

        <input value={address.roadAddress} placeholder="우편번호" readOnly />

        <div className={styles.form__address}>
          <input
            value={address.extraAddress}
            placeholder="도로명주소"
            readOnly
          />
          <input
            className={styles.form__input}
            value={address.jibunAddress}
            placeholder="상세주소"
          />
        </div>
      </div>
    </form>
  );
}

'use client';
import { Button } from '@/components';
import Modal from '@/components/layouts/Modal';
import styles from './AddressForm.module.scss';
import useAddressForm from './useAddressForm';

const USER_INPUT_NAME = ['name', 'phone', 'alias'] as const;
const ADDRESS_INPUT_NAME = ['roadAddress', 'extraAddress'] as const;

const USER_PLACEHOLDER = [
  '받으실 분의 이름을 입력해주세요.',
  ' - 없이 휴대폰 번호를 입력해주세요.',
  '배송받을 주소의 이름을 입력해주세요.',
] as const;
const ADDRESS_PLACEHOLDER = ['도로명주소', '상세주소', ' '] as const;
const FORM_TITLE = ['주문자 명', '연락처', '배송지 명'] as const;

declare global {
  interface Window {
    daum: any;
  }
}

export default function AddressForm({ onClose }: { onClose: () => void }) {
  const { handlePostcode, register, handleSubmit, errors, onSubmit } =
    useAddressForm(onClose);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.form__wrapper}>
        {FORM_TITLE.map((title, i) => (
          <div key={title}>
            <div className={styles.form__inner}>
              <p>{title}</p>
              <input
                autoComplete="off"
                placeholder={USER_PLACEHOLDER[i]}
                {...register(USER_INPUT_NAME[i])}
                className={styles.form__input}
              />
            </div>
            {errors[USER_INPUT_NAME[i]] && (
              <p className={styles.form__error}>
                {errors[USER_INPUT_NAME[i]]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={styles.form__wrapper}>
        <h5>주소 검색</h5>

        <div className={styles.form__address}>
          <input {...register('zonecode')} readOnly placeholder="우편번호" />
          <Button
            text="우편번호 찾기"
            variant="lined--r"
            onClick={handlePostcode}
          />
        </div>

        {ADDRESS_INPUT_NAME.map((name, i) => (
          <div key={name}>
            <div className={styles.form__address}>
              <input
                autoComplete="off"
                {...register(name)}
                readOnly={name !== 'extraAddress'}
                placeholder={ADDRESS_PLACEHOLDER[i]}
              />
            </div>
            {errors[ADDRESS_INPUT_NAME[i]] && (
              <p className={styles.form__error}>
                {errors[ADDRESS_INPUT_NAME[i]]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <Modal.Footer onClose={onClose} />
    </form>
  );
}

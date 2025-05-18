'use client';

import {
  type UserAddressForm,
  addressQueries,
  useAddressForm,
} from '@/features/user/address';
import { useCreateAddressMutation } from '@/features/user/address';
import { Button, Modal } from '@findyourkicks/shared';
import { useQueryClient } from '@tanstack/react-query';
import styles from './AddressForm.module.scss';

const USER_FIELDS = [
  {
    name: 'name',
    title: '주문자 명',
    placeholder: '받으실 분의 이름을 입력해주세요.',
  },
  {
    name: 'phone',
    title: '연락처',
    placeholder: ' - 없이 휴대폰 번호를 입력해주세요.',
  },
  {
    name: 'alias',
    title: '배송지 명',
    placeholder: '배송받을 주소의 이름을 입력해주세요.',
  },
] as const;

const ADDRESS_FIELDS = [
  {
    name: 'roadAddress',
    title: '도로명주소',
    placeholder: '도로명주소를 입력해주세요.',
  },

  {
    name: 'extraAddress',
    title: '상세주소',
    placeholder: '상세주소를 입력해주세요.',
  },
] as const;

declare global {
  interface Window {
    daum: any;
  }
}

const formatUserAddressRequest = (form: UserAddressForm) => ({
  ...form,
  address: `[${form.zonecode}] ${form.roadAddress} ${form.extraAddress}`,
});

export default function AddressForm({ onClose }: { onClose: () => void }) {
  const { handlePostcode, register, handleSubmit, errors } = useAddressForm();

  const queryClient = useQueryClient();
  const { mutate: mutateUserAddress } = useCreateAddressMutation();

  const handleCreateUserAddress = (data: UserAddressForm) => {
    mutateUserAddress(formatUserAddressRequest(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: addressQueries.list().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: addressQueries.default().queryKey,
        });
        onClose();
      },
    });
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(handleCreateUserAddress)}
    >
      <div className={styles.form__wrapper}>
        {USER_FIELDS.map(({ title, placeholder, name }) => (
          <div key={title}>
            <div className={styles.form__inner}>
              <p>{title}</p>
              <input
                autoComplete="off"
                placeholder={placeholder}
                {...register(name)}
                className={styles.form__input}
              />
            </div>
            {errors[name] && (
              <p className={styles.form__error}>{errors[name]?.message}</p>
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

        {ADDRESS_FIELDS.map(({ name, placeholder }) => (
          <div key={name}>
            <div className={styles.form__address}>
              <input
                autoComplete="off"
                {...register(name)}
                readOnly={name !== 'extraAddress'}
                placeholder={placeholder}
              />
            </div>
            {errors[name] && (
              <p className={styles.form__error}>{errors[name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <Modal.Footer onClose={onClose} />
    </form>
  );
}

import {
  FormActions,
  ProductBasicForm,
  ProductImageUploader,
  ProductOptionForm,
  useProductForm,
} from '@/features/product';
import { PATH } from '@/shared';
import { Modal, useModalControl } from '@findyourkicks/shared';
import { useNavigate } from 'react-router-dom';
import styles from './ProductRegister.module.scss';

export default function ProductRegister() {
  const navigate = useNavigate();
  const { isOpen, closeModal, toggleModal } = useModalControl(false);
  const {
    register,
    handleSubmitForm,
    control,
    handleDraftToLocal,
    handleReset,
    handleImageInputChange,
    errors,
    savedTime,
    previews,
  } = useProductForm({
    onSuccess: () => {
      toggleModal();
    },
  });

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmitForm}>
        <div className={styles.container}>
          <ProductBasicForm
            control={control}
            register={register}
            errors={errors}
          />
          <ProductOptionForm errors={errors} control={control} />
          <ProductImageUploader
            previews={previews}
            onInputChange={handleImageInputChange}
            errors={errors}
          />
        </div>

        <FormActions
          onResetClick={handleReset}
          onDraftClick={handleDraftToLocal}
          savedTime={savedTime}
        />
      </form>

      {isOpen && (
        <Modal title="상품 등록" isOpen={isOpen}>
          <div className={styles.alert}>상품 등록이 완료되었습니다.</div>
          <Modal.Footer
            buttons={[
              {
                text: '상품 더 추가하기',
                onClick: closeModal,
                variant: 'secondary',
              },
              {
                text: '홈으로 가기',
                onClick: () => navigate(PATH.default),
                variant: 'primary',
              },
            ]}
          />
        </Modal>
      )}
    </>
  );
}

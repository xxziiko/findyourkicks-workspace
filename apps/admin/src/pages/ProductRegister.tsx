import {
  FormActions,
  type Product,
  ProductBasicForm,
  ProductImageUploader,
  ProductOptionForm,
  productSchema,
  useImageUploader,
  useProductMutation,
} from '@/features/product';
import { PATH } from '@/shared';
import { Modal, useImagePreview, useModalControl } from '@findyourkicks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import styles from './ProductRegister.module.scss';

const MAX_IMAGE_COUNT = 1;

const formSchema = productSchema.extend({
  category: z.string({ required_error: '카테고리를 선택해주세요.' }),
  brand: z.string({ required_error: '브랜드를 선택해주세요.' }),
  productName: z.string().min(1, { message: '상품명을 입력해주세요.' }),
  price: z
    .number({ message: '숫자만 입력해주세요.' })
    .refine((val) => val > 0, {
      message: '판매가는 0원 이상이어야 합니다.',
    }),
  description: z.string().min(1, { message: '상품 상세 정보를 입력해주세요.' }),
  images: z
    .array(z.string())
    .min(1, { message: '상품 이미지를 추가해주세요.' }),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1),
        stock: z.number().refine((val) => val > 0),
      }),
    )
    .min(1, { message: '사이즈를 선택해주세요.' }),
});

export default function ProductRegister() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
      sizes: [],
    },
  });

  const { handleImageInputChange, previews, resetPreviews } = useImagePreview({
    maxCount: MAX_IMAGE_COUNT,
  });
  const handleUpload = useImageUploader();
  const { mutate: postProduct } = useProductMutation();
  const { isOpen, closeModal, toggleModal } = useModalControl(false);

  const updateForm = async () => {
    const urls = await handleUpload(previews);

    setValue('images', urls);
  };

  const navigate = useNavigate();

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updateForm();
    await handleSubmit(onSubmit)();
  };

  const onSubmit = (data: Product) => {
    postProduct(data, {
      onSuccess: () => {
        toggleModal();
        handleReset();
      },
    });
  };

  const handleReset = () => {
    reset();
    resetPreviews();
  };

  const goToHome = () => {
    navigate(PATH.default);
  };

  return (
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

      <FormActions onResetClick={handleReset} />

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
                onClick: goToHome,
                variant: 'primary',
              },
            ]}
          />
        </Modal>
      )}
    </form>
  );
}

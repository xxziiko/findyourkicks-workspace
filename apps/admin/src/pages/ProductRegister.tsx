import {
  FormActions,
  type Product,
  ProductBasicForm,
  ProductImageUploader,
  ProductOptionForm,
  productSchema,
  useImageUploader,
  useOptionSize,
  useProductMutation,
} from '@/features/product';
import { useImagePreview, useModalControl } from '@findyourkicks/shared';
import { Modal } from '@findyourkicks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import styles from './ProductRegister.module.scss';

const MAX_IMAGE_COUNT = 1;

const formSchema = productSchema.extend({
  category: z.string({ required_error: '카테고리를 선택해주세요.' }),
  brand: z.string({ required_error: '브랜드를 선택해주세요.' }),
  productName: z.string({ required_error: '상품명을 입력해주세요.' }),
  price: z
    .number({ message: '숫자만 입력해주세요.' })
    .refine((val) => val > 0, {
      message: '판매가는 0원 이상이어야 합니다.',
    }),
  description: z.string({ required_error: '상품 상세 정보를 입력해주세요.' }),
  images: z.array(z.string({ required_error: '상품 이미지를 추가해주세요.' })),
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
  const { handlePreviews, previews, resetPreviews } = useImagePreview({
    maxCount: MAX_IMAGE_COUNT,
  });
  const handleUpload = useImageUploader();
  const {
    selectedSizes,
    handleSelectAllSizes,
    handleApplyAllStock,
    updateSelectedSizes,
    handleChangeSelectedSizes,
    deleteSelectedSize,
    resetSelectedSizes,
  } = useOptionSize();
  const { mutate: postProduct } = useProductMutation();
  const { isOpen, closeModal, toggleModal } = useModalControl(false);
  const updateForm = async () => {
    const urls = await handleUpload(previews);

    setValue('sizes', selectedSizes);
    setValue('images', urls);
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updateForm();
    await handleSubmit(onSubmit)();
  };

  const onSubmit = (data: Product) => {
    postProduct(data, {
      onSuccess: () => {
        toggleModal();
        reset();
        resetPreviews();
        resetSelectedSizes();
      },
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmitForm}>
      <div className={styles.container}>
        <ProductBasicForm
          control={control}
          register={register}
          errors={errors}
        />
        <ProductOptionForm
          sizes={selectedSizes}
          errors={errors}
          onSelectAllSizes={handleSelectAllSizes}
          onApplyAllStock={handleApplyAllStock}
          onUpdateSizes={updateSelectedSizes}
          onChangeSizes={handleChangeSelectedSizes}
          onDeleteSize={deleteSelectedSize}
        />
        <ProductImageUploader
          errors={errors}
          previews={previews}
          handlePreviews={handlePreviews}
        />
      </div>

      <FormActions onReset={reset} />

      {isOpen && (
        <Modal title="상품 등록" isOpen={isOpen}>
          <div className={styles.alert}>상품 등록이 완료되었습니다.</div>
          <Modal.Footer onClose={closeModal} type="single" />
        </Modal>
      )}
    </form>
  );
}

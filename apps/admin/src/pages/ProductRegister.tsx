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
import { useImagePreview } from '@findyourkicks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import styles from './ProductRegister.module.scss';

const MAX_IMAGE_COUNT = 1;

const formSchema = productSchema.extend({
  category: z.string({ required_error: '카테고리를 선택해주세요.' }),
  brand: z.string({ required_error: '브랜드를 선택해주세요.' }),
  productName: z.string().min(1, '상품명을 입력해주세요.'),
  price: z
    .number({ message: '숫자만 입력해주세요.' })
    .refine((val) => val > 0, {
      message: '판매가는 0원 이상이어야 합니다.',
    }),
  description: z.string().min(1, '상품 상세 정보를 입력해주세요.'),
  images: z.array(z.string()).min(1, '상품 이미지를 추가해주세요.'),
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
  });
  const { handlePreviews, previews } = useImagePreview({
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
  } = useOptionSize();
  const { mutate: postProduct } = useProductMutation();

  const updateForm = async () => {
    const urls = await handleUpload(previews);

    setValue('sizes', selectedSizes);
    setValue('images', urls);
  };

  const handleSubmitForm = async (e: MouseEvent<Element>) => {
    e.preventDefault();

    await updateForm();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: Product) => {
    postProduct(data, {
      onSuccess: () => {
        reset();
        // TODO: toast or modal 확인창
      },
    });
  };

  return (
    <form className={styles.form}>
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

      <FormActions onReset={reset} onUpdate={handleSubmitForm} />
    </form>
  );
}

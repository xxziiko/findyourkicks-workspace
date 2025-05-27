import {
  FormActions,
  type FormSchema,
  ProductBasicForm,
  ProductImageUploader,
  ProductOptionForm,
  useImageUploader,
  useOptionSize,
  useProductRegisterForm,
} from '@/features/product';
import { useImagePreview } from '@findyourkicks/shared';
import styles from './ProductRegister.module.scss';

const MAX_IMAGE_COUNT = 1;

export default function ProductRegister() {
  const { setValue, handleSubmit, control, reset, register, errors } =
    useProductRegisterForm();
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

  const updateForm = async () => {
    const urls = await handleUpload(previews);

    setValue('sizes', selectedSizes);
    setValue('images', urls);
  };

  const onSubmit = async (data: FormSchema) => {
    console.log('data', data);
    // mutation
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

      <FormActions onReset={reset} onUpdate={updateForm} />
    </form>
  );
}

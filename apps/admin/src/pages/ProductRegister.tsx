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
  const { selectedSizes } = useOptionSize();
  const { handlePreviews, previews } = useImagePreview({
    maxCount: MAX_IMAGE_COUNT,
  });
  const { setValue, handleSubmit, control, reset, register } =
    useProductRegisterForm();
  const handleUpload = useImageUploader(setValue);

  const onSubmit = (data: FormSchema) => {
    setValue('sizes', selectedSizes);
    handleUpload(previews);
    console.log('data', data);
    // mutation
  };

  //TODO:  form 담기, mutation 연결

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <ProductBasicForm control={control} register={register} />
      <ProductOptionForm />
      <ProductImageUploader
        previews={previews}
        handlePreviews={handlePreviews}
      />

      <FormActions onReset={reset} />
    </form>
  );
}

import {
  type ProductRegisterForm,
  registerFormSchema,
  useFormDraft,
  useImageUploader,
  useProductMutation,
} from '@/features/product';
import { getDraft } from '@/shared';
import { useImagePreview } from '@findyourkicks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';

const MAX_IMAGE_COUNT = 1;

const defaultValues = {
  productName: '',
  price: 0,
  description: '',
  sizes: [],
  images: [],
};

export function useProductRegisterForm({
  onSuccess,
}: { onSuccess: () => void }) {
  const parsedDraft = getDraft<ProductRegisterForm>();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ProductRegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: parsedDraft ?? defaultValues,
  });

  const { handleDraftToLocal, savedTime } = useFormDraft({
    getValues,
    watch,
  });

  const { handleImageInputChange, previews, resetPreviews } = useImagePreview({
    maxCount: MAX_IMAGE_COUNT,
  });
  const handleUpload = useImageUploader();

  const { mutate: postProduct } = useProductMutation({
    onSuccess: () => {
      onSuccess();
      handleReset();
    },
  });

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await syncUploadedImages();
    await handleSubmit((data) => postProduct(data))();
  };

  const syncUploadedImages = async () => {
    const urls = await handleUpload(previews);

    setValue('images', urls);
  };

  const handleReset = () => {
    reset(defaultValues);
    resetPreviews();
    localStorage.removeItem('draft');
  };

  return {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    errors,
    handleDraftToLocal,
    savedTime,
    handleImageInputChange,
    handleReset,
    previews,
    handleSubmitForm,
  };
}

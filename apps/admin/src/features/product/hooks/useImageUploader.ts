import { supabase } from '@/shared/utils';
import { useCallback, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { z } from 'zod';
import { useImageMutation } from './mutations';

const getImageUrlSchema = z.object({
  publicUrl: z.string(),
});

type ImageUrl = z.infer<typeof getImageUrlSchema>;

const BUCKET_NAME = 'products';

const getImageUrl = async (filePath: string): Promise<ImageUrl> => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return getImageUrlSchema.parse({ publicUrl });
};

export function useImageUploader(setValue: UseFormSetValue<any>) {
  const { mutate: uploadImages } = useImageMutation();

  const handleUpload = useCallback(
    async (previews: string[]) => {
      uploadImages(previews);

      const urls = await Promise.all(
        previews.map(async (preview) => {
          const filePath = `products/${Date.now()}_${preview}`;
          const { publicUrl } = await getImageUrl(filePath);
          return publicUrl;
        }),
      );

      setValue('image', urls);
    },
    [uploadImages, setValue],
  );

  return handleUpload;
}

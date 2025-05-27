import { supabase } from '@/shared/utils';
import { handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const uploadImagesSchema = z.object({
  urls: z.array(z.string()),
});

type UploadImages = z.infer<typeof uploadImagesSchema>;

const BUCKET_NAME = 'products';

const uploadImage = async (file: string, filePath: string) => {
  await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)
    .then(handleError);
};

const uploadImages = async (files: string[]) => {
  for (const file of files) {
    const filePath = `products/${Date.now()}_${file}`;

    await uploadImage(file, filePath);
  }
};

export { uploadImages, type UploadImages };

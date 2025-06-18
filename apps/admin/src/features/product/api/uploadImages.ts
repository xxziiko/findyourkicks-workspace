import { supabase } from '@/shared';
import { z } from 'zod';

const uploadImagesSchema = z.object({
  urls: z.array(z.string()),
});

type UploadImages = z.infer<typeof uploadImagesSchema>;

const BUCKET_NAME = 'products';

const uploadImage = async ({
  filePath,
  webpFile,
}: { filePath: string; webpFile: File }) => {
  await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, webpFile, { upsert: true });
};

export { uploadImage, type UploadImages };

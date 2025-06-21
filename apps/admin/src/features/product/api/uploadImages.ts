import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { z } from 'zod';

const uploadImagesSchema = z.object({
  urls: z.array(z.string()),
});

type UploadImages = z.infer<typeof uploadImagesSchema>;

const uploadImage = async ({
  filePath,
  webpFile,
}: { filePath: string; webpFile: File }) => {
  const data = await api.post<UploadImages>(API_PATH.uploadImages, {
    body: {
      filePath,
      webpFile,
    },
  });

  return data;
};

export { uploadImage, type UploadImages };

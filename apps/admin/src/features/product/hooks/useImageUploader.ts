import { sanitizeFileName, supabase } from '@/shared';
import { assert } from '@findyourkicks/shared';
import { useCallback, useId } from 'react';
import { z } from 'zod';
import { useImageMutation } from './mutations';

const getImageUrlSchema = z.object({
  publicUrl: z.string(),
});

type ImageUrl = z.infer<typeof getImageUrlSchema>;

const BUCKET_NAME = 'products';

const covertImageToWebp = async (file: string): Promise<File> => {
  const imageBlob = await fetch(file).then((res) => res.blob());
  const imageBitmap = await createImageBitmap(imageBlob);

  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');
  ctx?.drawImage(imageBitmap, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/webp'),
  );

  assert(blob, '이미지 변환 실패');

  return new File([blob], `${Date.now()}.webp`, {
    type: 'image/webp',
  });
};

const getImageUrl = async (filePath: string): Promise<ImageUrl> => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  assert(publicUrl, '이미지 업로드 실패');
  return getImageUrlSchema.parse({ publicUrl });
};

export function useImageUploader() {
  const { mutate: uploadImage } = useImageMutation();
  const uuid = useId();

  const handleUpload = useCallback(
    async (previews: string[]) => {
      const uploadedUrls = await Promise.all(
        previews.map(async (preview) => {
          const webpFile = await covertImageToWebp(preview);
          const filePath = `${sanitizeFileName(uuid)}_${sanitizeFileName(webpFile.name)}`;

          uploadImage({ filePath, webpFile });

          const { publicUrl } = await getImageUrl(filePath);
          return publicUrl;
        }),
      );

      return uploadedUrls;
    },
    [uploadImage, uuid],
  );

  return handleUpload;
}

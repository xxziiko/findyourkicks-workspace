import { ENDPOINTS } from '@/shared/constants';
import { request } from '@/shared/utils/api';
import { MAX_REVIEW_IMAGES } from '../constants';

interface UploadReviewImagesResponse {
  urls: string[];
}

const uploadReviewImages = async (files: File[]) => {
  const formData = new FormData();
  const limited = files.slice(0, MAX_REVIEW_IMAGES);
  limited.forEach((file) => formData.append('files', file));

  return await request<UploadReviewImagesResponse>(
    'POST',
    ENDPOINTS.reviewUpload,
    undefined,
    {
      body: formData,
      headers: {},
    },
  );
};

export { uploadReviewImages, type UploadReviewImagesResponse };

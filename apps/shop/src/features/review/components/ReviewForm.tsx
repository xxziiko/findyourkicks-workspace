'use client';

import { useState } from 'react';
import { uploadReviewImages } from '../api/uploadReviewImages';
import { MAX_REVIEW_IMAGES } from '../constants';
import { useCreateReviewMutation } from '../hooks/mutations/useCreateReviewMutation';
import styles from './ReviewForm.module.scss';
import StarRating from './StarRating';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  productId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createReview, isPending } = useCreateReviewMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const limited = files.slice(0, MAX_REVIEW_IMAGES - imageFiles.length);
    setImageFiles((prev) => [...prev, ...limited].slice(0, MAX_REVIEW_IMAGES));
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      setIsUploading(true);
      try {
        const result = await uploadReviewImages(imageFiles);
        imageUrls = result.urls;
      } catch {
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const uploadedUrls = imageUrls;

    createReview(
      {
        productId,
        rating,
        content: content.trim() || undefined,
        imageUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      },
      {
        onSuccess,
        onError: async () => {
          if (uploadedUrls.length > 0) {
            await fetch('/api/reviews/upload', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ urls: uploadedUrls }),
            });
          }
        },
      },
    );
  };

  const isLoading = isUploading || isPending;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.form__rating}>
        <span className={styles.form__label}>별점</span>
        <StarRating
          value={rating}
          onChange={setRating}
          readonly={false}
          size="lg"
        />
      </div>

      <div className={styles.form__field}>
        <label className={styles.form__label} htmlFor="review-content">
          내용
        </label>
        <textarea
          id="review-content"
          className={styles.form__textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰를 작성해주세요."
          rows={4}
        />
      </div>

      <div className={styles.form__field}>
        <span className={styles.form__label}>
          사진 ({imageFiles.length}/{MAX_REVIEW_IMAGES})
        </span>
        <div className={styles.form__images}>
          {imageFiles.map((file, index) => (
            <div key={index} className={styles.form__imagePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={`미리보기 ${index + 1}`}
                className={styles.form__imageThumb}
              />
              <button
                type="button"
                className={styles.form__imageRemove}
                onClick={() => handleRemoveImage(index)}
                aria-label="이미지 삭제"
              >
                ×
              </button>
            </div>
          ))}
          {imageFiles.length < MAX_REVIEW_IMAGES && (
            <label className={styles.form__imageAdd}>
              <span>+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className={styles.form__fileInput}
              />
            </label>
          )}
        </div>
      </div>

      <div className={styles.form__actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.form__cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className={styles.form__submitBtn}
          disabled={rating === 0 || isLoading}
        >
          {isLoading ? '등록 중...' : '리뷰 등록'}
        </button>
      </div>
    </form>
  );
}

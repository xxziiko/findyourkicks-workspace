'use client';
import { Button, Carousel, Thumbnail } from '@/components';
import { useFileInputTrigger, useImagePreview } from '@/hooks';
import { overlay } from 'overlay-kit';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  single?: boolean;
  maxCount?: number;
}
export function ImageUpload({ single = true }: ImageUploadProps) {
  const { ref: fileInputRef, triggerClick } = useFileInputTrigger();
  const { handlePreviews, previews } = useImagePreview({ single });

  const handleCarousel = () => {
    overlay.open(({ close }) => {
      return <Carousel images={previews} onClose={close} />;
    });
  };

  return (
    <div>
      <Button type="button" onClick={triggerClick}>
        이미지 업로드
      </Button>

      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={(e) => handlePreviews(e)}
        ref={fileInputRef}
        className={styles.fileInput}
        multiple={!single}
      />

      {/* TODO: mutiple일 때 썸네일 개별 삭제 기능 추가 */}
      <div className={styles.thumbnailContainer}>
        {previews.map((src: string) => (
          <Thumbnail
            key={src}
            src={src}
            alt="thumbnail"
            width={100}
            height={100}
            onClick={handleCarousel}
          />
        ))}
      </div>
    </div>
  );
}

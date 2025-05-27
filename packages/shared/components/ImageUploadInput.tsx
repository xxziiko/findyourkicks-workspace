'use client';
import { overlay } from 'overlay-kit';
import { Button, Carousel, Thumbnail } from '.';
import { useFileInputTrigger } from '../hooks';
import styles from './ImageUploadInput.module.scss';

interface ImageUploadInputProps {
  previews: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxCount?: number;
  onUpload?: (files: File[]) => Promise<string[]>;
}

export function ImageUploadInput({
  maxCount = 1,
  previews,
  onChange,
}: ImageUploadInputProps) {
  const { ref: fileInputRef, triggerClick } = useFileInputTrigger();

  const handleCarousel = () => {
    overlay.open(({ close, isOpen }) => {
      return <Carousel images={previews} onClose={close} isOpen={isOpen} />;
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
        onChange={onChange}
        ref={fileInputRef}
        className={styles.fileInput}
        multiple={maxCount > 1}
      />

      {/* TODO: mutiple일 때 썸네일 개별 삭제 기능 추가 */}
      <div className={styles.thumbnailContainer}>
        {previews.map((src: string) => (
          <Thumbnail
            key={src}
            src={src}
            alt="thumbnail"
            width={400}
            height={400}
            onClick={handleCarousel}
          />
        ))}
      </div>
    </div>
  );
}

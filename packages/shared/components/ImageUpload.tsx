'use client';
import { useRef, useState } from 'react';
import { Button } from './Button';
import styles from './ImageUpload.module.scss';

export function ImageUpload({ multiple = false }: { multiple?: boolean }) {
  const [previewImg, setPreviewImg] = useState<any>([]);
  const [postImg, setPostImg] = useState<any>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadFile = (e: any) => {
    const fileArr = e.target.files;

    const fileUrl: string[] = [];
    const fileObjects: File[] = [];

    for (let i = 0; i < fileArr.length; i += 1) {
      const fileRead = new FileReader();

      fileRead.onload = () => {
        fileUrl.push(fileRead.result as string);
        setPreviewImg([...fileUrl]);
      };

      fileObjects.push(fileArr[i]);
      fileRead.readAsDataURL(fileArr[i]);
    }

    setPostImg(fileObjects);
  };

  const removeFile = (index: number) => {
    const updatedPostImg = [...postImg];
    const updatedPreviewImg = [...previewImg];

    updatedPostImg.splice(index, 1);
    updatedPreviewImg.splice(index, 1);

    setPostImg(updatedPostImg);
    setPreviewImg(updatedPreviewImg);
  };

  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  return (
    <div>
      <Button type="button" onClick={handleButtonClick}>
        이미지 업로드
      </Button>

      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={(e) => uploadFile(e)}
        ref={fileInput}
        className={styles.fileInput}
        multiple={multiple}
      />

      {/* 이미지 미리보기 */}
      {/* 클릭 시 캐러셀 */}
    </div>
  );
}

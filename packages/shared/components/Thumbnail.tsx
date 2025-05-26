interface ThumbnailProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export function Thumbnail({ alt, onClick, ...props }: ThumbnailProps) {
  return (
    <>
      <button type="button" onClick={onClick}>
        <img {...props} alt={alt} />
      </button>
    </>
  );
}

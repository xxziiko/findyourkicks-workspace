/**
 * Supabase Storage public URL에서 버킷 내 상대 경로를 추출합니다.
 * URL 형식: https://.../storage/v1/object/public/{bucket}/{path}
 */
export function extractStoragePath(
  publicUrl: string,
  bucket: string,
): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/public/${bucket}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return url.pathname.slice(idx + marker.length);
  } catch {
    return null;
  }
}

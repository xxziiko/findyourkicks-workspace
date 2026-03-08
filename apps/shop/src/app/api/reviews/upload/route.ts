import { MAX_REVIEW_IMAGES } from '@/features/review/constants';
import { extractStoragePath } from '@/shared/utils/storageUtils';
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json(
      { error: '업로드할 이미지가 없습니다.' },
      { status: 400 },
    );
  }

  if (files.length > MAX_REVIEW_IMAGES) {
    return NextResponse.json(
      { error: `이미지는 최대 ${MAX_REVIEW_IMAGES}장까지 업로드 가능합니다.` },
      { status: 400 },
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${user.id}/${timestamp}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: '이미지 업로드 실패', details: uploadError.message },
        { status: 500 },
      );
    }

    const { data: urlData } = supabase.storage
      .from('review-images')
      .getPublicUrl(path);

    urls.push(urlData.publicUrl);
  }

  return NextResponse.json({ urls });
}

// 고아 이미지 정리: 리뷰 생성 실패 시 업로드된 이미지를 삭제
export async function DELETE(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { urls } = (await req.json()) as { urls: string[] };

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ message: '삭제할 이미지가 없습니다.' });
  }

  const paths = urls
    .map((url) => extractStoragePath(url, 'review-images'))
    .filter((p): p is string => !!p?.startsWith(`${user.id}/`));

  if (paths.length > 0) {
    await supabase.storage.from('review-images').remove(paths);
  }

  return NextResponse.json({ message: '이미지가 삭제되었습니다.' });
}

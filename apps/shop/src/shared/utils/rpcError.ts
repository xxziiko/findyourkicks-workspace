export function mapRpcError(error: { code?: string; message?: string }): {
  status: number;
  error: string;
} {
  if (error.code === '23505') {
    return { status: 409, error: '중복 요청입니다.' };
  }
  if (error.code === 'P0001') {
    const msg = error.message ?? '';
    if (msg.startsWith('FORBIDDEN:'))
      return { status: 403, error: '권한이 없습니다.' };
    if (msg.startsWith('INVALID_STATE:'))
      return { status: 400, error: '현재 상태에서 처리할 수 없습니다.' };
    if (msg.startsWith('NOT_FOUND:'))
      return { status: 404, error: '리소스를 찾을 수 없습니다.' };
  }
  return { status: 500, error: '처리 중 오류가 발생했습니다.' };
}

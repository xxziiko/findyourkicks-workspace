import { useAdmin } from '@/features/auth';
import { useLocation } from 'react-router-dom';

export function useActiveTabTitle() {
  const { name } = useAdmin();
  const location = useLocation();
  const titleText = ` 반갑습니다, ${name}님!✋🎉`;
  const currentPath = location.pathname;

  const TAB_TITLE_MAP = {
    '/': titleText,
    '/products': '상품 조회/수정',
    '/products/new': '상품 등록',
    '/orders': '주문 내역',
  };

  return TAB_TITLE_MAP[currentPath as keyof typeof TAB_TITLE_MAP];
}

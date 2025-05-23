import { useAdmin } from '@/features/auth';
import { useCallback, useState } from 'react';

export function useActiveTabTitle() {
  const { name } = useAdmin();
  const titleText = ` 반갑습니다, ${name}님!✋🎉`;
  const [title, setTitle] = useState(titleText);

  const updateTitle = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const resetTitle = useCallback(() => {
    setTitle(titleText);
  }, [titleText]);

  return { title, updateTitle, resetTitle };
}

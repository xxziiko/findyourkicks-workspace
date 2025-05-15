import { useCallback, useState } from 'react';

export function useToggleTab() {
  const [openTabs, setOpenTabs] = useState<Record<string, boolean>>({});

  const toggleTab = useCallback((title: string) => {
    setOpenTabs((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  return { openTabs, toggleTab };
}

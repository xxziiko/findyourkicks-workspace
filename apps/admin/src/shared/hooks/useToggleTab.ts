import { useCallback, useState } from 'react';

export function useToggleTab() {
  const [openTabs, setOpenTabs] = useState<Record<string, boolean>>({});
  const [openSubTabs, setOpenSubTabs] = useState<Record<string, boolean>>({});

  const toggleTab = useCallback((title: string) => {
    setOpenTabs((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  const toggleSubTab = useCallback((title: string) => {
    setOpenSubTabs((prev) => {
      const newOpenTabs = { ...prev, [title]: !prev[title] };

      Object.keys(prev).forEach((key) => {
        if (key !== title) {
          newOpenTabs[key] = false;
        }
      });
      return newOpenTabs;
    });
  }, []);

  const resetTabs = useCallback(() => {
    setOpenSubTabs({});
  }, []);

  return { openTabs, openSubTabs, toggleTab, toggleSubTab, resetTabs };
}

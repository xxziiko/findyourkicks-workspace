import { useState } from 'react';

export function useSidebarControl() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return { isOpen, toggleSidebar, closeSidebar };
}

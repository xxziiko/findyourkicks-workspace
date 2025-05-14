import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Tabs.module.scss';

interface TabsProps {
  children: ReactNode;
}

interface TabProps {
  to: string;
  isActive?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const Tabs = ({ children }: TabsProps) => {
  return (
    <div className={styles.tabs}>
      <h1 className={styles.title}>findyourkicks</h1>
      {children}
    </div>
  );
};

const Tab = ({ to, isActive, onClick, children }: TabProps) => {
  return (
    <button
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      type="button"
    >
      <Link className={styles.tabLink} to={to}>
        {children}
      </Link>
    </button>
  );
};

Tabs.Tab = Tab;

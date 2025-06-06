import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './Tabs.module.scss';

interface TabsProps extends PropsWithChildren {
  isOpen: boolean;
}

export const Tabs = ({ children, isOpen }: TabsProps) => {
  return (
    <>
      {isOpen && (
        <nav className={styles.tabs}>
          <h1 className={styles.logo}>findyourkicks</h1>
          {children}
        </nav>
      )}
    </>
  );
};

interface TabProps extends PropsWithChildren {
  isActive?: boolean;
}

const Tab = ({ children, isActive }: TabProps) => {
  return (
    <div className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}>
      {children}
    </div>
  );
};

interface TabItemProps extends PropsWithChildren {
  to: string;
  isClicked?: boolean;
  onClick?: () => void;
}

const TabItem = ({ to, isClicked, onClick, children }: TabItemProps) => {
  return (
    <Link
      to={to}
      className={`${styles.tabItem} ${isClicked ? styles.active : ''}`}
      onClick={onClick}
    >
      <p className={styles.tabText}>{children}</p>
    </Link>
  );
};

interface TitleProps extends PropsWithChildren {
  onClick?: () => void;
}

const Title = ({ children, onClick }: TitleProps) => {
  return (
    <button type="button" onClick={onClick} className={styles.title}>
      <h3 className={styles.title}>{children}</h3>
    </button>
  );
};

Tabs.TabItem = TabItem;
Tabs.Title = Title;
Tabs.Tab = Tab;

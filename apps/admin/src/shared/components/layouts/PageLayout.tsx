import { PATH } from '@/shared';
import { Tabs } from '@/shared/components';
import { Outlet } from 'react-router-dom';
import styles from './PageLayout.module.scss';

const TAB_TITLES = [
  {
    title: '홈',
    path: PATH.default,
  },
  {
    title: '상품관리',
    path: PATH.products,
  },
] as const;

export function PageLayout() {
  return (
    <div className={styles.container}>
      <Tabs>
        {TAB_TITLES.map((tab) => (
          <Tabs.Tab key={tab.path} to={tab.path}>
            <h3>{tab.title}</h3>
          </Tabs.Tab>
        ))}
      </Tabs>

      <Outlet />
    </div>
  );
}

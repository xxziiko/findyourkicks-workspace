import { PATH, useToggleTab } from '@/shared';
import { Tabs } from '@/shared/components';
import { Link, Outlet } from 'react-router-dom';
import styles from './PageLayout.module.scss';

const TAB_TITLES = [
  {
    title: '상품관리',
    children: [
      {
        title: '상품 조회/수정',
        path: PATH.products,
      },
      {
        title: '상품 등록',
        path: PATH.products,
      },
    ],
  },
  {
    title: '판매관리',
    children: [
      {
        title: '주문 내역',
        path: PATH.orders,
      },
    ],
  },
] as const;

export function PageLayout() {
  const { openTabs, toggleTab } = useToggleTab();

  return (
    <div className={styles.container}>
      <Tabs>
        <Tabs.Title>
          <Link to={PATH.default}>홈</Link>
        </Tabs.Title>

        {TAB_TITLES.map(({ title, children }) => (
          <div key={title}>
            <Tabs.Title onClick={() => toggleTab(title)}>{title}</Tabs.Title>

            <Tabs.Tab isActive={openTabs[title]}>
              {children.map(({ title, path }) => (
                <Tabs.TabItem key={title} to={path}>
                  {title}
                </Tabs.TabItem>
              ))}
            </Tabs.Tab>
          </div>
        ))}
      </Tabs>

      <Outlet />
    </div>
  );
}

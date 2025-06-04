import {
  PATH,
  useActiveTabTitle,
  useSidebarControl,
  useToggleTab,
} from '@/shared';
import { Header, Tabs } from '@/shared/components';
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
        path: PATH.newProduct,
      },
    ],
  },
  {
    title: '주문관리',
    children: [
      {
        title: '주문 내역',
        path: PATH.orders,
      },
    ],
  },
] as const;

export function PageLayout() {
  const { openTabs, toggleTab, resetTabs, openSubTabs, toggleSubTab } =
    useToggleTab();
  const title = useActiveTabTitle();
  const { isOpen: isOpenSidebar, toggleSidebar } = useSidebarControl();

  return (
    <div className={styles.container}>
      <Tabs isOpen={isOpenSidebar}>
        <Link to={PATH.default}>
          <Tabs.Title onClick={resetTabs}>홈</Tabs.Title>
        </Link>

        {TAB_TITLES.map(({ title, children }) => (
          <div key={title}>
            <Tabs.Title onClick={() => toggleTab(title)}>{title}</Tabs.Title>

            <Tabs.Tab isActive={openTabs[title]}>
              {children.map(({ title, path }) => (
                <Tabs.TabItem
                  key={title}
                  to={path}
                  isClicked={openSubTabs[title]}
                  onClick={() => {
                    toggleSubTab(title);
                  }}
                >
                  {title}
                </Tabs.TabItem>
              ))}
            </Tabs.Tab>
          </div>
        ))}
      </Tabs>

      <main className={styles.main}>
        <Header
          text={title}
          isOpenSidebar={isOpenSidebar}
          toggleSidebar={toggleSidebar}
        />
        <Outlet />
      </main>
    </div>
  );
}

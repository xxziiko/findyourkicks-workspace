'use client';
import { PATH } from '@/shared/constants/path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MyTabs.module.scss';

const TABS = ['주문 내역'] as const;
const TAB_PATHS = [PATH.myOrders] as const;

export function MyTabs() {
  const pathname = usePathname();
  const currentTab = TAB_PATHS.findIndex((tab) => pathname.startsWith(tab));
  const isActive = (index: number) => currentTab === index;

  return (
    <nav className={styles.tab}>
      <p className={styles.tab__head}>마이페이지</p>

      <section className={styles.tab__section}>
        <h3>쇼핑 정보</h3>

        <div>
          {TABS.map((tab, index) => (
            <Link key={tab} href={TAB_PATHS[currentTab]}>
              <p
                key={tab}
                className={`${styles.tab__section__item} ${
                  isActive(index) && styles['tab__section--active']
                }`}
              >
                {tab}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </nav>
  );
}

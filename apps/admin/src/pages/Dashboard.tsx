import { DashboardCard } from '@/features/dashboard';
import {
  type CardItem,
  type OrderItem,
  useResentOrdersQuery,
} from '@/features/order';
import { PATH } from '@/shared/constants/path';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.scss';

const formatOrderDate = (date: string) => {
  return format(new Date(date), 'yyyy.MM.dd');
};

export default function Dashboard() {
  const { data: orders } = useResentOrdersQuery();

  const cards: CardItem<OrderItem>[] = [
    {
      id: 'latest-orders',
      title: '최근 주문 내역',
      tableHeader: ['주문번호', '주문일자', '주문상태'] as const,
      tableData: orders ?? [],
    },
    {
      id: 'latest-products',
      title: '최근 등록 상품',
      tableHeader: ['상품번호', '상품명', '등록일자'] as const,
      tableData: [],
    },
  ];

  const productStatistics = [
    {
      id: 'product-statistics',
      title: '상품 통계',
      items: ['판매 중 상품', '품절 상품'] as const,
      data: [],
    },
  ];

  return (
    <div className={styles.container}>
      <h1> 반갑습니다, 000 관리자님!✋🎉 </h1>

      <div className={styles.wrapper}>
        {cards.map(({ id, title, tableHeader, tableData }) => (
          <DashboardCard.TableCard<OrderItem>
            key={id}
            title={title}
            data={tableData}
            tableHeader={tableHeader}
            renderRow={({ id, orderId, orderDate, orderStatus }) => (
              <Link to={`${PATH.orders}/${id}`} key={id}>
                <div className={styles.listItem}>
                  <p>{orderId}</p>
                  <p>{formatOrderDate(orderDate)}</p>
                  <p>{orderStatus}</p>
                </div>
              </Link>
            )}
          />
        ))}
        {productStatistics.map(({ id, title, items, data }) => (
          <DashboardCard key={id}>
            <h3>{title}</h3>
            {items.map((item) => (
              <div key={item}>
                <p>{item}</p>
                <p>{data}</p>
              </div>
            ))}
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}

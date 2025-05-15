import { DashboardCard } from '@/features/dashboard';
import {
  type CardItem,
  type OrderItem,
  useResentOrdersQuery,
} from '@/features/order';
import { type ProductItem, useProductResentQuery } from '@/features/product';
import { PATH } from '@/shared/constants/path';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.scss';

const formatOrderDate = (date: string) => {
  return format(new Date(date), 'yyyy.MM.dd');
};

export default function Dashboard() {
  const { data: orders } = useResentOrdersQuery();
  const { data: products } = useProductResentQuery();

  const orderCard: CardItem<OrderItem> = {
    id: 'latest-orders',
    title: '최근 주문 내역',
    tableHeader: ['주문번호', '주문일자', '주문상태'] as const,
    tableData: orders ?? [],
  };

  const productCard: CardItem<ProductItem> = {
    id: 'latest-products',
    title: '최근 등록 상품',
    tableHeader: ['상품번호', '상품명', '등록일자'] as const,
    tableData: products ?? [],
  };

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
        <DashboardCard.TableCard<OrderItem>
          key={orderCard.id}
          title={orderCard.title}
          data={orderCard.tableData}
          tableHeader={orderCard.tableHeader}
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

        <DashboardCard.TableCard<ProductItem>
          key={productCard.id}
          title={productCard.title}
          data={productCard.tableData}
          tableHeader={productCard.tableHeader}
          renderRow={({ id, title, createdAt }) => (
            <Link to={`${PATH.products}/${id}`} key={id}>
              <div className={styles.listItem}>
                <p>{id}</p>
                <p>{title}</p>
                <p>{formatOrderDate(createdAt)}</p>
              </div>
            </Link>
          )}
        />

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

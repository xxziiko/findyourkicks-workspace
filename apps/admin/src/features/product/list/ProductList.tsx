import { type Product, ProductListTable } from '@/features/product';
import { CardSection, NoData } from '@/shared/components';
import { Pagination } from 'antd';

interface ProductListProps {
  products: Product[];
  lastPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function ProductList({
  products,
  lastPage,
  currentPage,
  onPageChange,
  isLoading,
}: ProductListProps) {
  return (
    <CardSection>
      {products.length === 0 ? (
        <NoData text="상품 데이터가 없습니다." />
      ) : (
        <>
          <ProductListTable products={products} isLoading={isLoading} />

          <Pagination
            total={lastPage}
            current={currentPage}
            onChange={onPageChange}
            align="center"
            showSizeChanger={false}
            showQuickJumper={false}
          />
        </>
      )}
    </CardSection>
  );
}

import {
  ProductList,
  ProductSearchFilter,
  ProductStatusSummary,
  useSearchProducts,
} from '@/features/product';
import { NoData } from '@/shared/components';
import styles from './Products.module.scss';

export default function Products() {
  const {
    handleSubmit,
    control,
    updateFilteredProducts,
    products,
    isLoading,
    resetForm,
    handlePageChange,
  } = useSearchProducts();
  const { list, last_page: lastPage, current_page: currentPage } = products;

  return (
    <>
      <ProductStatusSummary />

      <form
        className={styles.container}
        onSubmit={handleSubmit(updateFilteredProducts)}
      >
        <ProductSearchFilter control={control} onReset={resetForm} />

        <ProductList
          products={list}
          lastPage={lastPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </form>
    </>
  );
}

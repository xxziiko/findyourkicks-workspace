import {
  type Product,
  ProductListTable,
  type ProductSearchForm,
  useProductFormField,
  useSearchProducts,
} from '@/features/product';
import {
  CardSection,
  DatePicker,
  InputWithUnit,
  Loading,
  NoData,
} from '@/shared/components';
import {
  Button,
  Dropdown,
  commaizeNumberWithUnit,
} from '@findyourkicks/shared';
import { Pagination } from 'antd';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';
import styles from './Products.module.scss';

const filteredProducts = (products: Product[], status: string) =>
  products.filter((product) => product.status === status);

const statusMap = [
  {
    id: 'all',
    title: '전체',
    options: (products: Product[]) => products,
  },
  {
    id: 'pending',
    title: '판매 대기',
    options: (products: Product[]) => filteredProducts(products, 'pending'),
  },
  {
    id: 'selling',
    title: '판매 중',
    options: (products: Product[]) => filteredProducts(products, 'selling'),
  },
  {
    id: 'soldOut',
    title: '품절',
    options: (products: Product[]) => filteredProducts(products, 'soldOut'),
  },
];

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
  const { categories, brands } = useProductFormField();

  const cardSections = [
    {
      id: 'status',
      subTitle: '판매 상태',
      options: statusMap,
    },
    {
      id: 'category',
      subTitle: '카테고리',
      options: categories.map(({ category_id, name }) => ({
        id: category_id,
        title: name,
      })),
    },
    {
      id: 'brand',
      subTitle: '브랜드',
      options: brands.map(({ brand_id, name }) => ({
        id: brand_id,
        title: name,
      })),
    },
  ] as const;

  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit(updateFilteredProducts)}
    >
      {/* <CardSection>
        <div className={styles.sellerStatus}>
          {statusMap.map(({ id, title, options }) => (
            <div key={id}>
              <p>{title}</p>
              <p>{commaizeNumberWithUnit(options(total), '개')}</p>
            </div>
          ))}
        </div>
      </CardSection> */}

      <CardSection>
        <CardSection.ListItem subTitle="상품명">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <InputWithUnit
                id="search"
                placeholder="상품명을 입력해주세요."
                {...field}
              />
            )}
          />
        </CardSection.ListItem>

        {cardSections.map(({ id, subTitle, options }) => (
          <CardSection.ListItem key={id} subTitle={subTitle}>
            <Controller
              name={id as Exclude<keyof ProductSearchForm, 'period'>}
              control={control}
              render={({ field }) => (
                <Dropdown
                  selected={field.value as string}
                  onChange={field.onChange}
                  id={id}
                >
                  <Dropdown.Trigger />
                  <Dropdown.Menu>
                    {options.map(({ id, title }) => (
                      <Dropdown.Item key={id} text={title} />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            />
          </CardSection.ListItem>
        ))}

        <CardSection.ListItem subTitle="기간 조회 (등록일)">
          <Controller
            name="period"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={[
                  dayjs(field.value.startDate, 'YYYY.MM.DD'),
                  dayjs(field.value.endDate, 'YYYY.MM.DD'),
                ]}
                onChange={field.onChange}
              />
            )}
          />
        </CardSection.ListItem>

        <div className={styles.buttons}>
          <Button type="submit" variant="primary">
            조회
          </Button>
          <Button type="button" variant="secondary" onClick={() => resetForm()}>
            초기화
          </Button>
        </div>
      </CardSection>

      <CardSection>
        {isLoading && <Loading />}

        {list.length > 0 && !isLoading ? (
          <ProductList
            products={list}
            lastPage={lastPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <NoData text="검색 결과가 없습니다." />
        )}
      </CardSection>
    </form>
  );
}

function ProductList({
  products,
  lastPage,
  currentPage,
  onPageChange,
}: {
  products: Product[];
  lastPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <>
      <ProductListTable products={products} />
      <Pagination
        total={lastPage}
        current={currentPage}
        onChange={onPageChange}
        align="center"
        showSizeChanger={false}
        showQuickJumper={false}
      />
    </>
  );
}

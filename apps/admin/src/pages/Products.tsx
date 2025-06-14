import {
  type Product,
  ProductListTable,
  type ProductSearchForm,
  useProductFormField,
  useProductStatusQuery,
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

const statusMap = {
  all: '전체',
  pending: '판매 대기',
  selling: '판매 중',
  soldout: '품절',
} as const;

type Status = keyof typeof statusMap;
type ProductSearchFormKeyExcludePeriod = Exclude<
  keyof ProductSearchForm,
  'period'
>;

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

  const { data: statuses } = useProductStatusQuery();
  const { categories, brands } = useProductFormField();

  const cardSections = [
    {
      id: 'status',
      subTitle: '판매 상태',
      options: Object.entries(statusMap).map(([id, title]) => ({
        id,
        title,
      })),
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
      <CardSection>
        <div className={styles.sellerStatus}>
          {Object.entries(statuses).map(([status, count]) => (
            <div key={status}>
              <p>{statusMap[status as Status]}</p>
              <p>{commaizeNumberWithUnit(count, '개')}</p>
            </div>
          ))}
        </div>
      </CardSection>

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
              name={id as ProductSearchFormKeyExcludePeriod}
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

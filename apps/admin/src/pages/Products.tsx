import {
  type Product,
  ProductListTable,
  type ProductSearchForm,
  useProductFormField,
  useSearchProducts,
  useSearchProductsQuery,
} from '@/features/product';
import {
  CardSection,
  DatePicker,
  InputWithUnit,
  NoData,
} from '@/shared/components';
import {
  Button,
  Dropdown,
  commaizeNumberWithUnit,
} from '@findyourkicks/shared';
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
  const { handleSubmit, control, updateFilteredProducts, products } =
    useSearchProducts();
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
    <div className={styles.container}>
      <CardSection>
        <div className={styles.sellerStatus}>
          {statusMap.map(({ id, title, options }) => (
            <div key={id}>
              <p>{title}</p>
              <p>{commaizeNumberWithUnit(options(products).length, '개')}</p>
            </div>
          ))}
        </div>
      </CardSection>

      <CardSection>
        <CardSection.ListItem subTitle="검색어">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <InputWithUnit
                id="search"
                placeholder="검색어를 입력해주세요."
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
                  dayjs(field.value.startDate),
                  dayjs(field.value.endDate),
                ]}
                onChange={field.onChange}
              />
            )}
          />
        </CardSection.ListItem>

        <form
          className={styles.buttons}
          onSubmit={handleSubmit(updateFilteredProducts)}
        >
          <Button type="submit" variant="primary">
            조회
          </Button>
          <Button type="button" variant="secondary">
            초기화
          </Button>
        </form>
      </CardSection>

      <CardSection>
        {products.length > 0 ? (
          <ProductListTable products={products} />
        ) : (
          <NoData text="검색 결과가 없습니다." />
        )}
      </CardSection>
    </div>
  );
}

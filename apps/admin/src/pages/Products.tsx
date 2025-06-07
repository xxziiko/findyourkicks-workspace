import {
  type Product,
  ProductListTable,
  productQueries,
  useProductFormField,
} from '@/features/product';
import { CardSection, InputWithUnit } from '@/shared/components';
import {
  Button,
  Dropdown,
  commaizeNumberWithUnit,
} from '@findyourkicks/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import styles from './Products.module.scss';

const filteredProducts = (products: Product[], status: string) =>
  products.filter((product) => product.status === status);

const statusMap = [
  {
    id: 'all',
    title: '전체',
    data: (products: Product[]) => products,
  },
  {
    id: 'pending',
    title: '판매 대기',
    data: (products: Product[]) => filteredProducts(products, 'pending'),
  },
  {
    id: 'selling',
    title: '판매 중',
    data: (products: Product[]) => filteredProducts(products, 'selling'),
  },
  {
    id: 'soldOut',
    title: '품절',
    data: (products: Product[]) => filteredProducts(products, 'soldOut'),
  },
];

export default function Products() {
  const { data: products } = useSuspenseQuery(productQueries.list());
  const { categories, brands } = useProductFormField();

  return (
    <div className={styles.container}>
      <CardSection>
        <div className={styles.sellerStatus}>
          {statusMap.map(({ id, title, data }) => (
            <div key={id}>
              <p>{title}</p>
              <p>{commaizeNumberWithUnit(data(products).length, '개')}</p>
            </div>
          ))}
        </div>
      </CardSection>

      <CardSection>
        <CardSection.ListItem subTitle="검색어">
          <InputWithUnit id="search" placeholder="검색어를 입력해주세요." />
        </CardSection.ListItem>
        <CardSection.ListItem subTitle="판매 상태">
          <Dropdown
            selected={statusMap[0].title}
            onChange={() => {}}
            id="sellingStatus"
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {statusMap.map(({ id, title }) => (
                <Dropdown.Item key={id} text={title} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </CardSection.ListItem>

        <CardSection.ListItem subTitle="카테고리">
          <Dropdown
            selected={'카테고리를 선택해주세요.'}
            onChange={() => {}}
            id="category"
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {categories.map(({ category_id, name }) => (
                <Dropdown.Item key={category_id} text={name} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </CardSection.ListItem>

        <CardSection.ListItem subTitle="브랜드">
          <Dropdown
            selected={'브랜드를 선택해주세요.'}
            onChange={() => {}}
            id="brand"
          >
            <Dropdown.Trigger />
            <Dropdown.Menu>
              {brands.map(({ brand_id, name }) => (
                <Dropdown.Item key={brand_id} text={name} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </CardSection.ListItem>

        <CardSection.ListItem subTitle="기간 조회" />

        <div className={styles.buttons}>
          <Button variant="primary">조회</Button>
          <Button variant="secondary">초기화</Button>
        </div>
      </CardSection>

      <CardSection>
        <ProductListTable products={products} />
      </CardSection>
    </div>
  );
}

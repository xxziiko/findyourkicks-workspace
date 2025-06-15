import {
  FilterActionButtons,
  PRODUCT_STATUS,
  type ProductSearchForm,
  useProductFormField,
} from '@/features/product';
import { CardSection, DatePicker, InputWithUnit } from '@/shared/components';
import { Dropdown } from '@findyourkicks/shared';
import dayjs from 'dayjs';
import { type Control, Controller } from 'react-hook-form';

type ProductSearchFormKeyExcludePeriod = Exclude<
  keyof ProductSearchForm,
  'period'
>;

interface ProductSearchFilterProps {
  control: Control<ProductSearchForm>;
  onReset: () => void;
}

export function ProductSearchFilter({
  control,
  onReset,
}: ProductSearchFilterProps) {
  const { categories, brands } = useProductFormField();

  const cardSections = [
    {
      id: 'status',
      subTitle: '판매 상태',
      options: PRODUCT_STATUS.map(({ id, title }) => ({
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

      <FilterActionButtons onReset={onReset} />
    </CardSection>
  );
}

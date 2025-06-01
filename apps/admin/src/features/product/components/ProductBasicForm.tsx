import type { Product } from '@/features/product';
import { CardSection, ErrorMessage, InputWithUnit } from '@/shared/components';
import { Dropdown } from '@findyourkicks/shared';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import styles from './ProductBasicForm.module.scss';

const FORM_LIST_FIELDS = [
  {
    id: 'category',
    title: '카테고리',
    options: ['운동화'],
  },
  {
    id: 'brand',
    title: '브랜드',
    options: ['nike', 'vans', 'converse', 'new balance', 'adidas', 'puma'],
  },
] as const;

const FORM_FIELDS = [
  {
    id: 'productName',
    title: '상품명',
    placeholder: '상품명을 입력해주세요.',
    unit: '',
  },
  {
    id: 'price',
    title: '판매가',
    placeholder: '숫자만 입력해주세요.',
    unit: '원',
  },

  {
    id: 'description',
    title: '상품 상세 정보',
    placeholder: '상품 상세 정보를 입력해주세요.',
    unit: '',
  },
];

interface ProductBasicFormProps {
  control: Control<Product>;
  register: UseFormRegister<Product>;
  errors: FieldErrors<Product>;
}

export function ProductBasicForm({
  control,
  register,
  errors,
}: ProductBasicFormProps) {
  return (
    <div className={styles.container}>
      <CardSection title="카테고리">
        {FORM_LIST_FIELDS.map(({ id, title, options }) => (
          <CardSection.ListItem subTitle={title} key={title}>
            <div className={styles.dropdown}>
              <Controller
                control={control}
                name={id as keyof Product}
                render={({ field }) => (
                  <Dropdown
                    testId={id}
                    variant="border"
                    selected={
                      (field.value as string) ?? `${title}를 선택해주세요.`
                    }
                    onChange={field.onChange}
                  >
                    <Dropdown.Trigger />
                    <Dropdown.Menu>
                      {options.map((option) => (
                        <Dropdown.Item key={option} text={option} />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              />

              {errors[id as keyof Product] && (
                <ErrorMessage
                  id={id}
                  error={errors[id as keyof Product]?.message}
                />
              )}
            </div>
          </CardSection.ListItem>
        ))}
      </CardSection>

      {FORM_FIELDS.map(({ id, title, placeholder, unit }) => (
        <CardSection title={title} key={id} aria-label={title}>
          <InputWithUnit
            id={id}
            placeholder={placeholder}
            unit={unit}
            {...register(id as keyof Product, {
              valueAsNumber: id === 'price',
            })}
          />
          {errors[id as keyof Product] && (
            <ErrorMessage
              id={id}
              error={errors[id as keyof Product]?.message}
            />
          )}
        </CardSection>
      ))}
    </div>
  );
}

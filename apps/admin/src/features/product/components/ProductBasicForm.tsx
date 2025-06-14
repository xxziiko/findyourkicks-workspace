import {
  type ProductRegisterForm,
  useProductFormField,
} from '@/features/product';
import { CardSection, ErrorMessage, InputWithUnit } from '@/shared/components';
import { Dropdown } from '@findyourkicks/shared';
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import styles from './ProductBasicForm.module.scss';

const INPUT_FIELDS = [
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
  control: Control<ProductRegisterForm>;
  register: UseFormRegister<ProductRegisterForm>;
  errors: FieldErrors<ProductRegisterForm>;
}

type ProductBasicFormKey = keyof ProductRegisterForm;

export function ProductBasicForm({
  control,
  register,
  errors,
}: ProductBasicFormProps) {
  const { selectFields } = useProductFormField();

  return (
    <div className={styles.container}>
      <CardSection title="카테고리">
        {selectFields.map(({ id, title, options }) => (
          <CardSection.ListItem subTitle={title} key={title}>
            <div className={styles.dropdown}>
              <Controller
                control={control}
                name={id as ProductBasicFormKey}
                render={({ field }) => (
                  <Dropdown
                    id={id}
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

              {errors[id as ProductBasicFormKey] && (
                <ErrorMessage
                  id={id}
                  error={errors[id as ProductBasicFormKey]?.message}
                />
              )}
            </div>
          </CardSection.ListItem>
        ))}
      </CardSection>

      {INPUT_FIELDS.map(({ id, title, placeholder, unit }) => (
        <CardSection title={title} key={id} aria-label={title}>
          <InputWithUnit
            id={id}
            placeholder={placeholder}
            unit={unit}
            {...register(id as ProductBasicFormKey, {
              valueAsNumber: id === 'price',
            })}
          />
          {errors[id as ProductBasicFormKey] && (
            <ErrorMessage
              id={id}
              error={errors[id as ProductBasicFormKey]?.message}
            />
          )}
        </CardSection>
      ))}
    </div>
  );
}

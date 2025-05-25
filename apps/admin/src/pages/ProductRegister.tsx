import { OptionSizeTable, useOptionSize } from '@/features/product';
import { CardSection, InputWithUnit } from '@/shared';
import { SIZES } from '@/shared/constants';
import { Button, Dropdown, ImageUpload } from '@findyourkicks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import styles from './ProductRegister.module.scss';

const FORM_LIST_FIELDS = [
  {
    title: '카테고리',
    options: ['운동화'],
  },
  {
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
    id: 'detail',
    title: '상품 상세 정보',
    placeholder: '상품 상세 정보를 입력해주세요.',
    unit: '',
  },
];

const formSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  brand: z.string().min(1, '브랜드를 선택해주세요.'),
  productName: z.string().min(1, '상품명을 입력해주세요.'),
  price: z
    .number({ message: '숫자만 입력해주세요.' })
    .refine((val) => val > 0, {
      message: '판매가는 0원 이상이어야 합니다.',
    }),
  detail: z.string().min(1, '상품 상세 정보를 입력해주세요.'),
  sizes: z.array(z.object({ size: z.string(), stock: z.number() })),
  image: z.string().min(1, '상품 이미지를 추가해주세요.'),
});

export default function ProductRegister() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    selectedSizes,
    handleSelectAllSizes,
    handleApplyAllStock,
    updateSelectedSizes,
    handleChangeSelectedSizes,
    deleteSelectedSize,
  } = useOptionSize();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setValue('sizes', selectedSizes);
    console.log('data', data);
    // mutation
  };

  const optionButtonText =
    selectedSizes.length === SIZES.length ? '전체 선택 해제' : '전체 선택';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.container}>
        <CardSection title="카테고리">
          {FORM_LIST_FIELDS.map(({ title, options }) => (
            <CardSection.ListItem subTitle={title} key={title}>
              <Controller
                control={control}
                name={title as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <Dropdown
                    variant="border"
                    selected={
                      (field.value as string) ?? `${title}를 선택해주세요.`
                    }
                    setSelected={field.onChange}
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
            </CardSection.ListItem>
          ))}
        </CardSection>

        {FORM_FIELDS.map(({ id, title, placeholder, unit }) => (
          <CardSection title={title} key={id}>
            <InputWithUnit
              id={id}
              placeholder={placeholder}
              unit={unit}
              {...register(id as keyof z.infer<typeof formSchema>)}
            />
          </CardSection>
        ))}

        <CardSection title="옵션">
          <div className={styles.size}>
            <div>
              <p className={styles.sizeTitle}>사이즈</p>
              <p className={styles.description}>
                등록할 사이즈 옵션을 선택해주세요.
              </p>
            </div>

            <div className={styles.sizeButtons}>
              <Button type="button" onClick={handleSelectAllSizes}>
                {optionButtonText}
              </Button>
              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant="secondary"
                  type="button"
                  onClick={() => updateSelectedSizes(size)}
                  disabled={selectedSizes.some((s) => s.size === size)}
                >
                  {size}
                </Button>
              ))}
            </div>

            {/* 선택한 옵션 테이블 - 재고 일괄 적용 또는 개별 적용 */}
            {selectedSizes.length > 0 && (
              <>
                <CardSection.ListItem subTitle="재고 일괄 적용">
                  <div className={styles.stockInput}>
                    <InputWithUnit
                      id="stock"
                      placeholder="숫자만 입력해주세요."
                      unit="개"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleApplyAllStock(Number(e.target.value))
                      }
                    />
                  </div>
                </CardSection.ListItem>

                <OptionSizeTable
                  selectedSizes={selectedSizes}
                  onChange={handleChangeSelectedSizes}
                  onDelete={deleteSelectedSize}
                />
              </>
            )}
          </div>
        </CardSection>

        <CardSection title="상품 이미지">
          <p className={styles.description}>
            상품 이미지를 추가해주세요. <br /> 최대 1개까지 추가할 수 있습니다.
          </p>
          <ImageUpload />
        </CardSection>
      </div>

      <div className={styles.buttons}>
        <Button type="button" variant="secondary">
          임시저장
        </Button>
        <Button type="submit" variant="primary">
          등록하기
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset()}>
          취소
        </Button>
      </div>
    </form>
  );
}

import {
  type ProductSearchForm,
  type ProductSearchFormKey,
  productQueries,
  productSearchFormSchema,
} from '@/features/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchProductsQuery } from './queries';

const FORMAT_DATE = 'YYYY.MM.DD';
const FORM_DEFAULT_VALUES = {
  period: {
    startDate: dayjs('2025-01-01').format(FORMAT_DATE),
    endDate: dayjs().format(FORMAT_DATE),
  },
} as const;

const defaultValues = {
  period: FORM_DEFAULT_VALUES.period,
  status: '전체',
  category: '카테고리를 선택해주세요.',
  brand: '브랜드를 선택해주세요.',
  search: '',
  page: 1,
} as const;

export const useSearchProducts = () => {
  const [params, setParams] = useState<Partial<ProductSearchForm>>({});
  const {
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields },
  } = useForm<ProductSearchForm>({
    defaultValues,
    resolver: zodResolver(productSearchFormSchema),
  });

  const {
    data: products = { list: [], total: 0, current_page: 1, last_page: 1 },
    isLoading,
  } = useSearchProductsQuery(params);

  const queryClient = useQueryClient();

  const updateFilteredProducts = (form: ProductSearchForm) => {
    const filtered = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        form[key as ProductSearchFormKey],
      ]),
    ) as Partial<ProductSearchForm>;

    const newParams = { ...filtered, page: 1 };
    queryClient.fetchQuery(productQueries.list(newParams));
    setParams(newParams);
  };

  const handlePageChange = (nextPage: number) => {
    const { page: currentPage, ...rest } = params;

    const newParams = { ...rest, page: nextPage };
    queryClient.fetchQuery(productQueries.list(newParams));
    setParams(newParams);
  };

  return {
    handleSubmit,
    control,
    updateFilteredProducts,
    products,
    isLoading,
    resetForm: reset,
    handlePageChange,
  };
};

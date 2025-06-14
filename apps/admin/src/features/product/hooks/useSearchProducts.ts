import {
  type Product,
  type ProductSearchForm,
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
    startDate: dayjs().format(FORMAT_DATE),
    endDate: dayjs().format(FORMAT_DATE),
  },
} as const;

const defaultValues = {
  period: FORM_DEFAULT_VALUES.period,
  status: '전체',
  category: '카테고리를 선택해주세요.',
  brand: '브랜드를 선택해주세요.',
  search: '',
} as const;

export const useSearchProducts = () => {
  const { data: products = [] } = useSearchProductsQuery();

  const { handleSubmit, control } = useForm<ProductSearchForm>({
    defaultValues,
    resolver: zodResolver(productSearchFormSchema),
  });

  const queryClient = useQueryClient();
  const updateFilteredProducts = (form: ProductSearchForm) => {
    queryClient.setQueryData(productQueries.list().queryKey, {
      ...form,
      period: {
        startDate: form.period.startDate as string,
        endDate: form.period.endDate as string,
      },
    });
  };

  return {
    handleSubmit,
    control,
    updateFilteredProducts,
    products,
  };
};

import { useBrandQuery, useCategoryQuery } from './queries';

export function useProductFormField() {
  const { data: categories  } = useCategoryQuery();
  const { data: brands  } = useBrandQuery();

  const selectFields = [
    {
      id: 'category',
      title: '카테고리',
      options: categories.map((category) => category.name),
    },
    {
      id: 'brand',
      title: '브랜드',
      options: brands.map((brand) => brand.name),
    },
  ];

  return { selectFields, categories, brands };
}

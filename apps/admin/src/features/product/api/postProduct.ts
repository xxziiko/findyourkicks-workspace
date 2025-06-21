import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { type ProductRegisterForm, registerFormSchema } from '../types';

const postProduct = async (product: ProductRegisterForm) => {
  const validatedProduct = registerFormSchema.parse(product);

  return await api.post(API_PATH.products, validatedProduct);
};

export { postProduct };

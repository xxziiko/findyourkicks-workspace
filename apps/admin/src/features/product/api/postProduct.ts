import { api } from '@/shared';
import { API_PATH } from '@/shared/constants/apiPath';
import { type ProductRegisterForm, registerFormSchema } from '../types';

const postProduct = async (product: ProductRegisterForm) => {
  const validatedProduct = registerFormSchema.parse(product);
  const {
    category,
    brand,
    productName,
    description,
    price,
    images,
    sizes,
    status,
  } = validatedProduct;

  return await api.post(API_PATH.products, {
    body: {
      _brand: brand,
      _category: category,
      _title: productName,
      _price: price,
      _description: description,
      _images: images,
      _sizes: sizes,
      _status: status,
    },
  });
};

export { postProduct };

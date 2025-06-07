import { supabase } from '@/shared/utils';
import { handleError } from '@findyourkicks/shared';
import { type ProductForm, formSchema } from '../types';

const postProduct = async (product: ProductForm) => {
  const validatedProduct = formSchema.parse(product);
  const { category, brand, productName, description, price, images, sizes } =
    validatedProduct;

  return await supabase
    .rpc('insert_product_with_inventory', {
      _brand: brand,
      _category: category,
      _title: productName,
      _price: price,
      _description: description,
      _images: images,
      _sizes: sizes,
    })
    .then(handleError);
};

export { postProduct };

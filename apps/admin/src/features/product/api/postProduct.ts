import { supabase } from '@/shared/utils';
import { assert, handleError } from '@findyourkicks/shared';
import { z } from 'zod';

const productSchema = z.object({
  category: z.string(),
  brand: z.string(),
  productName: z.string(),
  price: z.number(),
  description: z.string(),
  sizes: z.array(z.object({ size: z.string(), stock: z.number() })),
  images: z.array(z.string()),
});

type Product = z.infer<typeof productSchema>;

const postProduct = async (product: Product) => {
  const validatedProduct = productSchema.parse(product);
  const { category, brand, productName, description, price, images, sizes } =
    validatedProduct;

  const { data } = await supabase
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

  console.log(data);
};

export { postProduct, type Product, productSchema };

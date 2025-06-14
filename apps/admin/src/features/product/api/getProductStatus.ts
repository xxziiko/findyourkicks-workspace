import { supabase } from '@/shared';
import { handleError } from '@findyourkicks/shared';

const getProductStatus = async () => {
  const { data } = await supabase
    .rpc('get_all_products_with_inventory')
    .then(handleError);
  return data;
};

export { getProductStatus };

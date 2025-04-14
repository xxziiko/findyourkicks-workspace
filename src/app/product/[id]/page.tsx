import { fetchProductById } from '@/features/product/apis';
import { Detail } from './_features';

export default async function DetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await fetchProductById(id);

  return <Detail data={data} />;
}

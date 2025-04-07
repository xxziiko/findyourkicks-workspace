export default async function CompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <>결제 성공이닷 주문번호:{id} </>;
}

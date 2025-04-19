export const handleError = <T>({
  data,
  error,
}: { data: T; error: unknown }) => {
  if (!data || error) throw error;

  return data;
};

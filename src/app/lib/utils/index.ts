export const handleError = <T>({
  data,
  error,
}: { data: T; error: unknown }) => {
  if (!data || error) throw error;

  return data;
};

export const assert: (
  condition: unknown,
  message: string,
) => asserts condition = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

export async function tryCatchFetch<T>(
  url: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, init);
    const errorData = await response.json();

    if (!response.ok) {
      console.log(errorData.error ?? `status: ${response.status}`);
      throw new Error(errorData.error || 'Fetch failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

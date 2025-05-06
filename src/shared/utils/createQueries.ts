/**
 * QueryConfig 타입은 쿼리 함수(queryFn)를 정의하는 형식입니다.
 * - TArgs: 쿼리 함수에 전달할 인자의 타입 배열
 * - TData: 쿼리 함수가 반환할 데이터 타입
 */
type QueryConfig<TArgs extends any[], TData> = {
  queryFn: (...args: TArgs) => Promise<TData>;
};

/**
 * createQueries
 *
 * 쿼리 키(prefix + key + args)와 쿼리 함수(queryFn)를 함께 반환하는 객체를 생성합니다.
 * 각 쿼리에 대해 공통 기본 옵션(refetch 설정 등)도 함께 포함됩니다.
 *
 * @param prefix 쿼리 키의 공통 prefix
 * @param queries 각 쿼리의 정의 객체 (queryFn을 반환하는 팩토리 함수들)
 *
 * @returns 각 쿼리에 대해 queryKey, queryFn, 기본 옵션을 반환하는 함수들
 */
export function createQueries<
  T extends Record<string, (...args: any[]) => QueryConfig<any[], any>>,
>(prefix: string, queries: T) {
  const result: any = {};

  for (const key in queries) {
    result[key] = (...args: any[]) => {
      const { queryFn } = queries[key](...args);
      return {
        queryKey: [prefix, key, ...args],
        queryFn,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      };
    };
  }

  return result as {
    [K in keyof T]: (...args: Parameters<T[K]>) => {
      queryKey: [string, K, ...Parameters<T[K]>];
      queryFn: () => ReturnType<ReturnType<T[K]>['queryFn']>;
    };
  };
}

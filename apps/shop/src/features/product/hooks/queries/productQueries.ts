export const productKeys = {
  all: ['product'] as const,
  list: () => [...productKeys.all, 'list'] as const,
} as const;

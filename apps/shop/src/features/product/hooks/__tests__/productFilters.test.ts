import type { ProductFilters, SortOption } from '@/features/product/types';
import { describe, expect, it } from 'vitest';

// ---------------------------------------------------------------------------
// Pure logic extracted from useProductFilters for unit testing.
//
// useProductFilters depends on Next.js hooks (useSearchParams, useRouter,
// usePathname) which cannot run outside the Next.js runtime.  We replicate
// the four pure functions here and test them directly against controlled
// inputs, keeping tests decoupled from the framework.
// ---------------------------------------------------------------------------

// ---- replicated logic -------------------------------------------------------

const SORT_VALUES: SortOption[] = [
  'latest',
  'price_asc',
  'price_desc',
  'popular',
];

function isValidSort(value: string): value is SortOption {
  return SORT_VALUES.includes(value as SortOption);
}

function readFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ProductFilters {
  const q = searchParams.get('q') ?? undefined;
  const brand = searchParams.getAll('brand');
  const category = searchParams.getAll('category');
  const size = searchParams.getAll('size');
  const minPriceRaw = searchParams.get('minPrice');
  const maxPriceRaw = searchParams.get('maxPrice');
  const sortRaw = searchParams.get('sort');

  return {
    ...(q ? { q } : {}),
    ...(brand.length > 0 ? { brand } : {}),
    ...(category.length > 0 ? { category } : {}),
    ...(size.length > 0 ? { size } : {}),
    ...(minPriceRaw !== null ? { minPrice: Number(minPriceRaw) } : {}),
    ...(maxPriceRaw !== null ? { maxPrice: Number(maxPriceRaw) } : {}),
    ...(sortRaw && isValidSort(sortRaw) ? { sort: sortRaw } : {}),
  };
}

function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);

  if (filters.brand) {
    for (const b of filters.brand) {
      params.append('brand', b);
    }
  }

  if (filters.category) {
    for (const c of filters.category) {
      params.append('category', c);
    }
  }

  if (filters.size) {
    for (const s of filters.size) {
      params.append('size', s);
    }
  }

  if (filters.minPrice !== undefined) {
    params.set('minPrice', String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    params.set('maxPrice', String(filters.maxPrice));
  }

  if (filters.sort) {
    params.set('sort', filters.sort);
  }

  return params;
}

function countActiveFilters(filters: ProductFilters): number {
  let count = 0;

  if (filters.q && filters.q.trim() !== '') count++;
  if (filters.brand && filters.brand.length > 0) count++;
  if (filters.category && filters.category.length > 0) count++;
  if (filters.size && filters.size.length > 0) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.sort && filters.sort !== 'latest') count++;

  return count;
}

// ---- helpers ----------------------------------------------------------------

function makeParams(
  init: string | Record<string, string> = '',
): URLSearchParams {
  return new URLSearchParams(init);
}

// ---- tests ------------------------------------------------------------------

describe('isValidSort', () => {
  it('returns true for "latest"', () => {
    expect(isValidSort('latest')).toBe(true);
  });

  it('returns true for "price_asc"', () => {
    expect(isValidSort('price_asc')).toBe(true);
  });

  it('returns true for "price_desc"', () => {
    expect(isValidSort('price_desc')).toBe(true);
  });

  it('returns true for "popular"', () => {
    expect(isValidSort('popular')).toBe(true);
  });

  it('returns false for an unknown value', () => {
    expect(isValidSort('unknown')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidSort('')).toBe(false);
  });
});

describe('filtersToSearchParams', () => {
  it('returns empty params for an empty filters object', () => {
    const params = filtersToSearchParams({});
    expect(params.toString()).toBe('');
  });

  it('serialises the q field', () => {
    const params = filtersToSearchParams({ q: 'nike' });
    expect(params.get('q')).toBe('nike');
  });

  it('appends multiple brand values', () => {
    const params = filtersToSearchParams({ brand: ['Nike', 'Adidas'] });
    expect(params.getAll('brand')).toEqual(['Nike', 'Adidas']);
  });

  it('appends multiple size values', () => {
    const params = filtersToSearchParams({ size: ['270', '280'] });
    expect(params.getAll('size')).toEqual(['270', '280']);
  });

  it('serialises minPrice and maxPrice as strings', () => {
    const params = filtersToSearchParams({ minPrice: 10000, maxPrice: 50000 });
    expect(params.get('minPrice')).toBe('10000');
    expect(params.get('maxPrice')).toBe('50000');
  });

  it('serialises sort', () => {
    const params = filtersToSearchParams({ sort: 'price_asc' });
    expect(params.get('sort')).toBe('price_asc');
  });

  it('omits undefined fields entirely', () => {
    const params = filtersToSearchParams({ q: 'air', sort: 'popular' });
    expect(params.has('brand')).toBe(false);
    expect(params.has('minPrice')).toBe(false);
  });
});

describe('readFiltersFromSearchParams', () => {
  it('returns empty object for empty params', () => {
    const filters = readFiltersFromSearchParams(makeParams());
    expect(filters).toEqual({});
  });

  it('reads the q field', () => {
    const filters = readFiltersFromSearchParams(makeParams('q=jordan'));
    expect(filters.q).toBe('jordan');
  });

  it('reads multiple brand values', () => {
    const params = new URLSearchParams();
    params.append('brand', 'Nike');
    params.append('brand', 'New Balance');
    const filters = readFiltersFromSearchParams(params);
    expect(filters.brand).toEqual(['Nike', 'New Balance']);
  });

  it('reads minPrice and maxPrice as numbers', () => {
    const filters = readFiltersFromSearchParams(
      makeParams('minPrice=5000&maxPrice=30000'),
    );
    expect(filters.minPrice).toBe(5000);
    expect(filters.maxPrice).toBe(30000);
  });

  it('reads a valid sort value', () => {
    const filters = readFiltersFromSearchParams(makeParams('sort=price_desc'));
    expect(filters.sort).toBe('price_desc');
  });

  it('omits sort when the value is invalid', () => {
    const filters = readFiltersFromSearchParams(makeParams('sort=invalid'));
    expect(filters.sort).toBeUndefined();
  });

  it('roundtrips filters through serialise then deserialise', () => {
    const original: ProductFilters = {
      q: 'air max',
      brand: ['Nike'],
      category: ['running'],
      size: ['265', '270'],
      minPrice: 10000,
      maxPrice: 200000,
      sort: 'popular',
    };
    const params = filtersToSearchParams(original);
    const restored = readFiltersFromSearchParams(params);
    expect(restored).toEqual(original);
  });
});

describe('countActiveFilters', () => {
  it('returns 0 for an empty filters object', () => {
    expect(countActiveFilters({})).toBe(0);
  });

  it('counts q as 1 active filter', () => {
    expect(countActiveFilters({ q: 'nike' })).toBe(1);
  });

  it('does not count q when it is whitespace-only', () => {
    expect(countActiveFilters({ q: '   ' })).toBe(0);
  });

  it('counts brand array as 1 active filter regardless of array length', () => {
    expect(countActiveFilters({ brand: ['Nike', 'Adidas'] })).toBe(1);
  });

  it('counts minPrice and maxPrice as separate active filters', () => {
    expect(countActiveFilters({ minPrice: 0, maxPrice: 50000 })).toBe(2);
  });

  it('does not count "latest" sort as an active filter', () => {
    expect(countActiveFilters({ sort: 'latest' })).toBe(0);
  });

  it('counts non-latest sort as 1 active filter', () => {
    expect(countActiveFilters({ sort: 'price_asc' })).toBe(1);
  });

  it('counts all active fields together', () => {
    const filters: ProductFilters = {
      q: 'air',
      brand: ['Nike'],
      category: ['lifestyle'],
      size: ['270'],
      minPrice: 10000,
      maxPrice: 100000,
      sort: 'popular',
    };
    // q=1, brand=1, category=1, size=1, minPrice=1, maxPrice=1, sort=1 => 7
    expect(countActiveFilters(filters)).toBe(7);
  });
});

describe('edge cases', () => {
  it('minPrice of 0 is still counted as an active filter', () => {
    expect(countActiveFilters({ minPrice: 0 })).toBe(1);
  });

  it('empty brand array is not counted as an active filter', () => {
    expect(countActiveFilters({ brand: [] })).toBe(0);
  });
});

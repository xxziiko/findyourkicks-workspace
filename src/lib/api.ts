interface RawProduct {
  product_id: string;
  title: string;
  price: number;
  image: string;

  brand: {
    name: string;
  } | null;

  category: {
    name: string;
  } | null;
}

export const fetchProducts = async (page = 1): Promise<RawProduct[]> => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`,
  ).then((res) => res.json());
  return data;
};

export const fetchProductById = async (productId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
  ).then((res) => res.json());

// login
export const signInWithGoogle = async (next = '/') =>
  await fetch(`/api/auth/google?next=${encodeURIComponent(next)}`).then((res) =>
    res.json(),
  );

export const signInWithKakao = async (next = '/') =>
  await fetch(`/api/auth/kakao?next=${encodeURIComponent(next)}`).then((res) =>
    res.json(),
  );

export const signOutUser = async () =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
    method: 'POST',
  });

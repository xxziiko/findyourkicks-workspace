'use client';

import { productItem } from '@/app/lib/store';
import { DefaultButton } from '@/components';
import type { ProductItem } from '@/types/product';
import { Button } from '@headlessui/react';
import { useAtomValue } from 'jotai';
import Image from 'next/image';

export default function Detail() {
  const item = useAtomValue<ProductItem | null>(productItem);
  const sizes = [220, 230, 240, 250, 260, 270, 280, 290, 300, 310] as const;

  if (!item) return null;

  return (
    <article className="flex flex-col md:flex-row justify-center gap-8">
      <figure className="w-96 h-96 relative overflow-hidden ">
        <Image
          src={item.image ?? '/placeholder.jpg'}
          alt="product"
          fill
          sizes="100%"
        />
      </figure>

      <div className="border-l" />

      <section className="flex flex-col gap-6 md:w-1/2">
        <div>
          <p className="font-semibold ">{item.maker}</p>
          <p className="font-extrabold text-3xl">
            {Number(item.lprice).toLocaleString()} 원
          </p>
        </div>

        <div>
          <p className="">{item.title.replace(/(<b>|<\/b>)/g, '')}</p>
          <p className="text-sm text-stone-400 ">{`${item.brand} > ${item.category4}`}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {sizes.map((size) => (
            <Button
              key={size}
              className="border px-5 py-3 rounded-lg data-[hover]:opacity-50"
            >
              {size}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <DefaultButton
            command="장바구니"
            bgColor="bg-gray-800"
            color="text-white"
            onClick={() => {}}
          />

          <DefaultButton
            command="구매하기"
            bgColor="bg-white"
            color="text-black"
            onClick={() => {}}
          />
        </div>
      </section>
    </article>
  );
}

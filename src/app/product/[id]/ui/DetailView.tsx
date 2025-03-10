import { DefaultButton } from '@/components';
import type { DetailViewProps } from '@/types/product';
import { Button } from '@headlessui/react';
import Image from 'next/image';
import Option from './Option';

export default function DetailView(props: DetailViewProps) {
  const {
    item,
    price,
    inventory,
    totalQuantity,
    selectedOptions,

    handleSelectSize,
    onDeleteButtonClick,
    onIncrementButtonClick,
    onDecrementButtonClick,
    handleCartButton,
  } = props;

  return (
    <article className="flex justify-center item-center">
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <figure className="w-96 h-96 relative overflow-hidden ">
          <Image src={item.image} alt="product" fill sizes="100%" />
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
              onClick={() => handleSelectSize(size)}

          <div className="flex flex-wrap gap-4">
            {inventory.map(({ size, stock }) => (
              <Button
                key={size}
                className="border px-5 py-3 rounded-lg data-[hover]:opacity-50 disabled:bg-gray-200 disabled:text-gray-500"
                disabled={!stock}
              >
                {size}
              </Button>
            ))}
          </div>

          <div>
            <ul>
              {selectedOptions.map(({ size, quantity }) => (
                <Option
                  size={size}
                  quantity={quantity}
                  key={size}
                  price={price}
                  onIncrementButtonClick={onIncrementButtonClick}
                  onDecrementButtonClick={onDecrementButtonClick}
                  onDeleteButtonClick={onDeleteButtonClick}
                />
              ))}
            </ul>

            <div>
              <div className="flex justify-between py-6">
                <p className="font-semibold text-sm">합계</p>
                <p className="font-bold text-2xl">
                  {(totalQuantity * price).toLocaleString()}원
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <DefaultButton
                  command="장바구니"
                  bgColor="bg-gray-800"
                  color="text-white"
                  onClick={handleCartButton}
                />

                <DefaultButton
                  command="구매하기"
                  bgColor="bg-white"
                  color="text-gray"
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

'use client';

export default function Badge({ quantity }: { quantity: number }) {
  return (
    <span className=" bg-red-500 rounded-full text-white text-[7px] absolute top-[-8] right-[-8] w-[13px] h-[13px] flex justify-center items-center">
      <p>{quantity}</p>
    </span>
  );
}

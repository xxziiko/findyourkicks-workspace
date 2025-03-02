import { Button } from '@headlessui/react';

interface IButton {
  color: string;
  bgColor: string;
  command: string;
  onClick: () => void;
}

export default function DefaultButton({
  color,
  bgColor,
  command,
  onClick,
}: IButton) {
  return (
    <Button
      className={`rounded ${color} ${bgColor} py-3 text-sm text-white data-[hover]:opacity-65 w-full font-semibold border rounded-3xl`}
      onClick={onClick}
    >
      {command}
    </Button>
  );
}

import { Button } from '@headlessui/react';

export default function DefaultButton() {
  return (
    <Button className="rounded bg-yellow-200 py-2 px-4 text-sm text-white data-[hover]:bg-yellow-100 data-[active]:bg-yellow-400">
      안녕
    </Button>
  );
}

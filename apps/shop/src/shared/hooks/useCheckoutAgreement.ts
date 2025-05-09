import { atom, useAtom } from 'jotai';

const isAllCheckedAgreementAtom = atom(false);

export function useCheckoutAgreement() {
  const [isAllCheckedAgreement, setIsAllCheckedAgreement] = useAtom(
    isAllCheckedAgreementAtom,
  );

  return { isAllCheckedAgreement, setIsAllCheckedAgreement };
}

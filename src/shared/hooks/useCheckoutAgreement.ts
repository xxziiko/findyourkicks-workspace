import { atom, useAtom } from 'jotai';

const isAllCheckedAgreementAtom = atom(false);

export default function useCheckoutAgreement() {
  const [isAllCheckedAgreement, setIsAllCheckedAgreement] = useAtom(
    isAllCheckedAgreementAtom,
  );

  return { isAllCheckedAgreement, setIsAllCheckedAgreement };
}

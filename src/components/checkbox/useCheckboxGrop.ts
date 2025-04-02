import { useCallback, useState } from 'react';

type CheckBoxState = {
  [id: string]: boolean;
};

type CheckBoxHookReturn = {
  allChecked: boolean;
  checkedItems: CheckBoxState;
  handleToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggle: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  handleDeleteItem: (id: string) => void;
};

export const useCheckBoxGroup = (
  keys: string[],
  initialChecked = true,
): CheckBoxHookReturn => {
  const [checkedItems, setCheckedItems] = useState<CheckBoxState>(() =>
    Object.fromEntries(keys.map((id) => [id, initialChecked])),
  );

  const allChecked = keys.every((item) => checkedItems[item]);

  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setCheckedItems(Object.fromEntries(keys.map((id) => [id, checked])));
    },
    [keys],
  );

  const handleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, cartId: string) => {
      const checked = e.target.checked;
      setCheckedItems((prev) => ({ ...prev, [cartId]: checked }));
    },
    [],
  );

  const handleDeleteItem = (id: string) => {
    setCheckedItems((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return {
    allChecked,
    checkedItems,
    handleToggleAll,
    handleToggle,
    handleDeleteItem,
  };
};

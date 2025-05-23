'use client';

import { useState } from 'react';

export function useInputValue(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return { value, handleChange };
}

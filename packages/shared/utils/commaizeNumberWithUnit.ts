export const commaizeNumber = (number: number) => {
  return number.toLocaleString();
};

export const commaizeNumberWithUnit = (number: number, unit: string) => {
  return `${commaizeNumber(number)} ${unit}`;
};

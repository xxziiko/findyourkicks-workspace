export const assert: (
  condition: unknown,
  message: string,
) => asserts condition = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

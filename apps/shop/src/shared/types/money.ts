type KRW = number & { __brand: 'KRW' };
const toKRW = (n: number): KRW => n as KRW;

export type { KRW };
export { toKRW };

import { api } from '@/shared/api';
import type { ReturnItem } from '../types';

const getReturns = async (status?: string): Promise<ReturnItem[]> => {
  const params = status ? { status } : {};
  return api.get<ReturnItem[]>('/admin/returns', { params });
};

export { getReturns };

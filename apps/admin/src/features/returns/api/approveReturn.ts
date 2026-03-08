import { api } from '@/shared/api';

const approveReturn = async (returnId: string): Promise<{ message: string }> => {
  return api.post<{ message: string }>(`/admin/returns/${returnId}/approve`);
};

export { approveReturn };

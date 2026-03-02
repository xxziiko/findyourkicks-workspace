import { api } from '@/shared/api';

const rejectReturn = async (returnId: string): Promise<{ message: string }> => {
  return api.post<{ message: string }>(`/admin/returns/${returnId}/reject`);
};

export { rejectReturn };

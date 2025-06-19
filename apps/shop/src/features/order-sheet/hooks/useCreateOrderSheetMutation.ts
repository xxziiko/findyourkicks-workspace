'use client';
import { createOrderSheet } from '@/features/order-sheet/api/createOrderSheet';
import { useMutation } from '@tanstack/react-query';

export default function useCreateOrderSheetMutation({
  onSuccess,
}: {
  onSuccess: (data: { orderSheetId: string }) => void;
}) {
  return useMutation({
    mutationFn: createOrderSheet,
    onSuccess,
  });
}

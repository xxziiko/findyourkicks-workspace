'use client';
import { createOrderSheet } from '@/features/order-sheet/api/createOrderSheet';
import { useMutation } from '@tanstack/react-query';

export default function useCreateOrderSheetMutation() {
  return useMutation({
    mutationFn: createOrderSheet,
  });
}

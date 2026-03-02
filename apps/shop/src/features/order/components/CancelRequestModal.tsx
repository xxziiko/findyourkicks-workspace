'use client';
import { useState } from 'react';
import { useCancelOrderMutation } from '../hooks/mutations/useCancelOrderMutation';
import styles from './CancelRequestModal.module.scss';

interface CancelRequestModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CancelRequestModal({
  orderId,
  onClose,
  onSuccess,
}: CancelRequestModalProps) {
  const [reason, setReason] = useState('');
  const { mutate, isPending } = useCancelOrderMutation(orderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    mutate(
      { reason: reason.trim() },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="button"
      tabIndex={-1}
      aria-label="모달 닫기"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
      >
        <h2 id="cancel-modal-title" className={styles.title}>
          주문 취소 신청
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="cancel-reason" className={styles.label}>
              취소 사유 <span className={styles.required}>*</span>
            </label>
            <textarea
              id="cancel-reason"
              className={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="취소 사유를 입력해주세요."
              required
              rows={4}
            />
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isPending}
            >
              닫기
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isPending || !reason.trim()}
            >
              {isPending ? '처리중...' : '취소 신청'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

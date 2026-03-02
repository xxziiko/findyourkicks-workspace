'use client';
import { useState } from 'react';
import { useReturnOrderMutation } from '../hooks/mutations/useReturnOrderMutation';
import styles from './ReturnRequestForm.module.scss';

interface ReturnRequestFormProps {
  orderId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const RETURN_REASONS = ['단순 변심', '상품 불량', '오배송', '기타'] as const;

export function ReturnRequestForm({
  orderId,
  onClose,
  onSuccess,
}: ReturnRequestFormProps) {
  const [returnType, setReturnType] = useState<'return' | 'exchange'>('return');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const { mutate, isPending } = useReturnOrderMutation(orderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    mutate(
      { returnType, reason, details: details.trim() || undefined },
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
        aria-labelledby="return-modal-title"
      >
        <h2 id="return-modal-title" className={styles.title}>
          반품/교환 신청
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <span className={styles.label}>신청 유형</span>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="returnType"
                  value="return"
                  checked={returnType === 'return'}
                  onChange={() => setReturnType('return')}
                />
                반품
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="returnType"
                  value="exchange"
                  checked={returnType === 'exchange'}
                  onChange={() => setReturnType('exchange')}
                />
                교환
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="return-reason" className={styles.label}>
              사유 선택 <span className={styles.required}>*</span>
            </label>
            <select
              id="return-reason"
              className={styles.select}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">사유를 선택해주세요</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="return-details" className={styles.label}>
              상세 사유 <span className={styles.optional}>(선택)</span>
            </label>
            <textarea
              id="return-details"
              className={styles.textarea}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="상세 사유를 입력해주세요."
              rows={3}
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
              disabled={isPending || !reason}
            >
              {isPending ? '처리중...' : '신청'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

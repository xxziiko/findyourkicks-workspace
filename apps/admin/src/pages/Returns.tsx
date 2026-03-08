import { ReturnsTable } from '@/features/returns/components';
import {
  useApproveReturnMutation,
  useRejectReturnMutation,
  useReturnsQuery,
} from '@/features/returns/hooks';
import { Suspense, useState } from 'react';
import { Loading } from '@/shared/components';
import styles from './Returns.module.scss';

const STATUS_OPTIONS = [
  { label: '전체', value: undefined },
  { label: '처리 대기', value: 'requested' },
  { label: '승인', value: 'approved' },
  { label: '거부', value: 'rejected' },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]['value'];

function ReturnsContent({
  statusFilter,
}: { statusFilter: StatusFilter }) {
  const { data: returns } = useReturnsQuery(statusFilter);
  const { mutate: approve, isPending: isApproving } =
    useApproveReturnMutation();
  const { mutate: reject, isPending: isRejecting } =
    useRejectReturnMutation();

  return (
    <ReturnsTable
      returns={returns}
      onApprove={approve}
      onReject={reject}
      isProcessing={isApproving || isRejecting}
    />
  );
}

export default function Returns() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(undefined);

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        {STATUS_OPTIONS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className={`${styles.filterBtn} ${statusFilter === value ? styles.filterBtnActive : ''}`}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <Suspense fallback={<Loading />}>
        <ReturnsContent statusFilter={statusFilter} />
      </Suspense>
    </div>
  );
}

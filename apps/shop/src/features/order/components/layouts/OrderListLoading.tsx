'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function OrderListLoading() {
  return (
    <div style={{ marginTop: '16px', minHeight: '80vh' }}>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          <Skeleton width={128} height={128} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width={150} height={20} />
            <Skeleton width={150} height={20} />
            <Skeleton width={150} height={20} />
            <Skeleton width={150} height={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

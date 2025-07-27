import Skeleton from 'react-loading-skeleton';

export function BannerLoading() {
  return (
    <div style={{ paddingBottom: '32px' }}>
      <Skeleton width="100%" height="400px" />
    </div>
  );
}

import { PATH } from '@/shared';
import { Button } from '@findyourkicks/shared';
import { SearchCheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <SearchCheckIcon width={60} height={60} />
      <h3>페이지를 찾을 수 없습니다!</h3>
      <p>존재하지 않는 페이지입니다.</p>
      <Button variant="primary" onClick={() => navigate(PATH.default)}>
        홈으로 가기
      </Button>
    </div>
  );
}

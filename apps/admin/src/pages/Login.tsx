import { useSignInForm } from '@/features/auth';
import { PATH } from '@/shared';
import { Button } from '@findyourkicks/shared';
import { InfoIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

const INPUT_LABELS = [
  {
    label: '이메일',
    id: 'email',
    type: 'email',
  },
  {
    label: '비밀번호',
    id: 'password',
    type: 'password',
  },
] as const;

const TEST_DATA = [
  {
    label: '테스트 아이디',
    value: 'admin@example.com',
  },
  {
    label: '테스트 비밀번호',
    value: 'admin123',
  },
] as const;

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSignInLoading,
    setError,
  } = useSignInForm({
    onSuccess: () => {
      navigate(PATH.default);
    },
    onError: (error) => {
      if (error) {
        setError('email', {
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
        setError('password', {
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
      }
    },
  });

  return (
    <div className={styles.login}>
      <div className={styles.left}>
        <img src="/findyourkicks-stroke.png" alt="logo" />
      </div>

      <div className={styles.right}>
        <div className={styles.rightContainer}>
          <h3 className={styles.title}>로그인</h3>

          {/* <div className={styles.testContainer}>
            {TEST_DATA.map(({ label, value }) => (
              <div className={styles.testItem} key={label}>
                <p className={styles.itemLabel}>{label}</p>
                <p>{value}</p>
              </div>
            ))}
          </div> */}

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formContainer}>
              {INPUT_LABELS.map(({ label, id, type }) => (
                <div className={styles.formGroup} key={id}>
                  <label htmlFor={id}>{label}</label>
                  <input
                    type={type}
                    id={id}
                    data-testid={`${id}-error`}
                    {...register(id)}
                    className={styles.input}
                  />
                  {errors[id] && (
                    <span className={styles.error}>{errors[id]?.message}</span>
                  )}
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isSignInLoading}>
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

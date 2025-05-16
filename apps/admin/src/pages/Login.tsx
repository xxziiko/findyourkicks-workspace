import { useSignInForm } from '@/features/auth';
import { PATH } from '@/shared';
import { Button } from '@findyourkicks/shared';
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

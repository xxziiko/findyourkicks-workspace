import Button from '../Button';
import styles from './Modal.module.scss';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className={styles.modal__overlay}>
      <div className={styles.modal__container}>
        <Header title={title} />

        <div className={styles.layout}>{children}</div>

        <Footer onClose={onClose} />
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className={styles.header}>
      <h4>{title}</h4>
    </div>
  );
}

function Footer({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.footer}>
      <Button onClick={onClose} text="저장하기" width="15%" />

      <Button onClick={onClose} text="닫기" variant="lined--r" width="15%" />
    </div>
  );
}

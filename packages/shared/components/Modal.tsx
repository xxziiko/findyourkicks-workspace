'use client';

import { useEffect } from 'react';
import styles from './Modal.module.scss';
import { Button, GlobalPortal } from './index';

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

export function Modal({ title, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <GlobalPortal.Consumer>
      <div className={styles.modal__overlay}>
        <div className={styles.modal__container}>
          <Header title={title} />

          <div>{children}</div>
        </div>
      </div>
    </GlobalPortal.Consumer>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className={styles.header}>
      <h4>{title}</h4>
    </div>
  );
}

function Footer({
  onClose,
  type = 'default',
}: {
  onClose: () => void;
  type?: 'default' | 'single';
}) {
  return (
    <div className={styles.footer}>
      {type === 'default' && (
        <Button text="저장하기" width="15%" type="submit" />
      )}

      <Button onClick={onClose} text="닫기" variant="lined--r" width="15%" />
    </div>
  );
}

Modal.Footer = Footer;

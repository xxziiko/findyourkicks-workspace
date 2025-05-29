'use client';

import { useEffect } from 'react';
import styles from './Modal.module.scss';
import { Button, GlobalPortal } from './index';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

export function Modal({ title, children, isOpen }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <GlobalPortal.Consumer>
      {isOpen && (
        <div className={styles.modal__overlay}>
          <div className={styles.modal__container}>
            <Header title={title} />

            <div>{children}</div>
          </div>
        </div>
      )}
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
        <Button type="submit" radius width="30%">
          저장하기
        </Button>
      )}

      <Button onClick={onClose} variant="secondary" radius>
        닫기
      </Button>
    </div>
  );
}

Modal.Footer = Footer;

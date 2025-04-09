'use client';

import DeliveryForm from '@/app/(order-flow)/_features/DeliveryForm';
import { useEffect } from 'react';
import Button from '../Button';
import styles from './Modal.module.scss';
import Portal from './Portal';
interface ModalProps {
  title: string;
  children: React.ReactNode;
}

export default function Modal({ title, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Portal>
      <div className={styles.modal__overlay}>
        <div className={styles.modal__container}>
          <Header title={title} />

          <div>{children}</div>
        </div>
      </div>
    </Portal>
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
      <Button text="저장하기" width="15%" type="submit" />

      <Button onClick={onClose} text="닫기" variant="lined--r" width="15%" />
    </div>
  );
}

Modal.Footer = Footer;

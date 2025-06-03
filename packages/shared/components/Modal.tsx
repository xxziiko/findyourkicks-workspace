'use client';

import { useEffect } from 'react';
import styles from './Modal.module.scss';
import { Button, type ButtonProps, GlobalPortal } from './index';

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

interface ModalFooterButton extends ButtonProps {
  text: string;
}

interface ModalFooterProps {
  buttons: ModalFooterButton[];
}

function Footer({ buttons }: ModalFooterProps) {
  return (
    <div className={styles.footer}>
      {buttons.map(({ text, ...props }) => (
        <Button key={text} {...props} radius>
          {text}
        </Button>
      ))}
    </div>
  );
}

Modal.Footer = Footer;

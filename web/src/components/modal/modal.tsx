"use client";

import type { ReactNode } from "react";

import styles from "./modal.module.scss";

type ModalProps = {
  ariaLabelledBy: string;
  children: ReactNode;
  onClose: () => void;
  subtitle?: string;
  title: string;
};

export function Modal({
  ariaLabelledBy,
  children,
  onClose,
  subtitle,
  title,
}: ModalProps) {
  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        <div className={styles.header}>
          <div>
            <h2 id={ariaLabelledBy} className={styles.title}>
              {title}
            </h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>

          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

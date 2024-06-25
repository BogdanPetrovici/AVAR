'use client';

import styles from '@/app/ui/css/components/button.module.scss';

import { PencilIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function UpdateTransaction({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/transactions/${id}/edit`} className={styles.button}>
      <PencilIcon className={styles.buttonIcon} />
    </Link>
  );
}

export function ExpandTransaction({
  isPressed,
  onClick,
  className,
}: {
  isPressed: boolean;
  onClick: () => void;
  className?: string;
}) {
  const classes = isPressed
    ? `${styles.button} ${styles.pressed}`
    : styles.button;
  return (
    <a
      target="_blank"
      type="button"
      className={`${className} ${classes}`}
      onClick={onClick}
    >
      <ArrowDownIcon className={styles.buttonIcon} />
    </a>
  );
}

'use client';

import styles from '@/app/ui/css/transactions.module.css';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function UpdateTransaction({ id }: { id: string }) {
  return (
    <Link href={`/transactions/${id}/edit`} className={styles.editButton}>
      <PencilIcon className={styles.editButtonIcon} />
    </Link>
  );
}

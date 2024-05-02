'use client';

import styles from '@/app/ui/css/pagination.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ nextPage }: { nextPage?: string }) {
  return (
    <>
      <div className={styles.paginationWrapper}>
        <PaginationArrow direction="right" page={nextPage} />
      </div>
    </>
  );
}

function PaginationArrow({
  page,
  direction,
}: {
  page?: string;
  direction: 'left' | 'right';
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createPageURL = (bookmark: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', bookmark);
    return `${pathname}?${params.toString()}`;
  };

  const isDisabled = page === undefined;
  const className = clsx(styles.paginationLink, {
    [styles.disabled]: isDisabled,
    [styles.active]: !isDisabled,
  });
  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className={styles.paginationArrow} />
    ) : (
      <ArrowRightIcon className={styles.paginationArrow} />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={createPageURL(page)}>
      {icon}
    </Link>
  );
}

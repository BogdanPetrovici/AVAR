'use client';

import buttonStyles from '@/app/ui/css/components/button.module.scss';
import paginationStyles from '@/app/ui/css/components/pagination.module.scss';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ nextPage }: { nextPage?: string }) {
  return <PaginationArrow direction="right" page={nextPage} />;
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
  const className = clsx(buttonStyles.button, {
    [buttonStyles.disabled]: isDisabled,
    '': !isDisabled,
  });
  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className={buttonStyles.buttonIcon} />
    ) : (
      <ArrowRightIcon className={buttonStyles.buttonIcon} />
    );

  return isDisabled ? (
    <div className={paginationStyles.paginationContainer}>
      <div data-test="next-page-button-disabled" className={className}>
        {icon}
      </div>
    </div>
  ) : (
    <div className={paginationStyles.paginationContainer}>
      <Link
        data-test="next-page-button-active"
        className={className}
        href={createPageURL(page)}
      >
        {icon}
      </Link>
    </div>
  );
}

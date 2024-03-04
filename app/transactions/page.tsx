import { lusitana } from '@/app/ui/fonts';
import Transactions from '@/app/ui/transactions/transactions';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    from?: string;
    to?: string;
    page?: string;
  };
}) {
  const today = dayjs();
  dayjs.extend(customParseFormat);
  let fromDate = today.subtract(100, 'day');
  if (searchParams?.from) {
    fromDate = dayjs(searchParams?.from, 'YYYY-MM-DD');
  }

  let toDate = today;
  if (searchParams?.to) {
    toDate = dayjs(searchParams?.to, 'YYYY-MM-DD');
  }

  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transactions</h1>
      </div>
      <Transactions from={fromDate} to={toDate} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}

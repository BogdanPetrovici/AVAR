import { getTags, getTransactionById } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import EditForm from '@/app/ui/transactions/edit-form';

export default async function Page({ params }: { params: { id: string } }) {
  const [transaction, tags] = await Promise.all([
    getTransactionById(params.id),
    getTags(),
  ]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Edit transaction</h1>
      </div>
      <EditForm transaction={transaction} tags={tags} />
    </div>
  );
}

import styles from '@/app/ui/css/page.module.scss';

import { tagRepository } from '@/app/lib/repository/tag';
import { transactionRepository } from '@/app/lib/repository/transaction';
import { lusitana } from '@/app/ui/fonts';
import DeleteForm from '@/app/ui/transactions/delete-form';
import EditForm from '@/app/ui/transactions/edit-form';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const [transaction, tags] = await Promise.all([
    transactionRepository.getById(params.id),
    tagRepository.getTags(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeading}>
        <div>
          <h1 className={`${lusitana.className} ${styles.headingText}`}>
            Edit transaction
          </h1>
        </div>
        <DeleteForm transaction={transaction} />
      </header>
      <EditForm transaction={transaction} tags={tags} />
    </main>
  );
}

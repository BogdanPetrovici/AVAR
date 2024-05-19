import styles from '@/app/ui/css/page.module.css';

import { getTags } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import CreateForm from '@/app/ui/transactions/create-form';

export default async function Page({ params }: { params: { id: string } }) {
  const tags = await getTags();

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeading}>
        <div>
          <h1 className={`${lusitana.className} ${styles.headingText}`}>
            Create transaction
          </h1>
        </div>
      </header>
      <CreateForm tags={tags} />
    </main>
  );
}

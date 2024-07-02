import styles from '@/app/ui/css/page.module.scss';

import { tagRepository } from '@/app/lib/repository/tag.repository';
import { lusitana } from '@/app/ui/fonts';
import CreateForm from '@/app/ui/transactions/create-form';

export default async function Page({ params }: { params: { id: string } }) {
  const tagData = await tagRepository.getTags();

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeading}>
        <div>
          <h1 className={`${lusitana.className} ${styles.headingText}`}>
            Create transaction
          </h1>
        </div>
      </header>
      <CreateForm tags={tagData.Tags} />
    </main>
  );
}

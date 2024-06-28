import styles from '@/app/ui/css/page.module.scss';
import { lusitana } from '@/app/ui/fonts';

import Tags from '@/app/ui/tags/tags';

export default async function Page() {
  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeading}>
        <h1 className={`${lusitana.className} ${styles.headingText}`}>Tags</h1>
      </header>
      <Tags />
    </main>
  );
}

import styles from '@/app/ui/css/nav.module.css';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div>
      <div className={`${lusitana.className} ${styles.logoContainer}`}>
        <GlobeAltIcon className={styles.logoIcon} />
        <p className={styles.logoText}>AVAR</p>
      </div>
    </div>
  );
}

'use client';

import styles from '@/app/ui/css/nav.module.css';

import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: CurrencyDollarIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`${styles.menuItem} ${
              pathname === link.href ? styles.menuItemSelected : ''
            }`}
          >
            <LinkIcon className={styles.menuItemIcon} />
            <p className={styles.menuItemText}>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

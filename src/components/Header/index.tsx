import Link from 'next/link';
import Head from 'next/head';

import styles from './header.module.scss';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <>
      <Head>
        <title>
          {title ? `${title} | <\\> spacetraveling` : '<\\> spacetraveling'}
        </title>
      </Head>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/">
            <a>
              <img src="/images/logo.svg" alt="logo" />
            </a>
          </Link>
        </div>
      </header>
    </>
  );
}

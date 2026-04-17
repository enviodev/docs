import React from 'react';
import Head from '@docusaurus/Head';
import styles from './styles.module.css';

export default function NewsletterSection() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <script async src="https://subscribe-forms.beehiiv.com/embed.js" />
      </Head>
      <iframe
        src="https://subscribe-forms.beehiiv.com/dd4ebec6-c87d-48c8-a571-4a88f5ba124d"
        className={styles.iframe}
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}

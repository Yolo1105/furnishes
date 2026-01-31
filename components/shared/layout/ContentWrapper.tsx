import React from 'react';
import styles from './ContentWrapper.module.css';

type ContentWrapperProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function ContentWrapper({ children, sidebar }: ContentWrapperProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContent}>{children}</div>
      {sidebar}
    </div>
  );
}

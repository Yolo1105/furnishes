'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import RadioGroup from '../components/RadioGroup';
import {
  organizationOptions,
  homeLifeOptions,
  plantOptions,
} from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function LifeRealityPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const answers = (state.answers['page-8'] as {
    organization?: string;
    homeLife?: string;
    plants?: string;
  }) || {};

  const handleOrganizationSelect = (id: string) => {
    setAnswer('page-8', { ...answers, organization: id });
  };

  const handleHomeLifeSelect = (id: string) => {
    setAnswer('page-8', { ...answers, homeLife: id });
  };

  const handlePlantsSelect = (id: string) => {
    setAnswer('page-8', { ...answers, plants: id });
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>Let&apos;s be honest here. We need to know what your actual life is like, not the Instagram-perfect version of it.</h2>
        <p className={styles.instruction}>
          No judgment at all - we&apos;re all just trying to make our spaces work for us. The more real you are, the better suggestions we can give you.
        </p>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.radioGroupsContainer}>
          <div className={styles.questionGroup}>
            <h3 className={styles.subQuestion}>How organized are you really? Are you one of those people who has a place for everything, or is your organization style more... let&apos;s call it &quot;creative&quot;?</h3>
            <RadioGroup
              options={organizationOptions}
              selected={answers.organization || null}
              onSelect={handleOrganizationSelect}
              name="organization"
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.questionGroup}>
            <h3 className={styles.subQuestion}>Do you have pets or kids running around your home, or is it just you (and maybe a partner or roommate)?</h3>
            <RadioGroup
              options={homeLifeOptions}
              selected={answers.homeLife || null}
              onSelect={handleHomeLifeSelect}
              name="homeLife"
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.questionGroup}>
            <h3 className={styles.subQuestion}>Can you actually keep plants alive, or are you one of those people who manages to kill even the most indestructible succulents? No shame either way.</h3>
            <RadioGroup
              options={plantOptions}
              selected={answers.plants || null}
              onSelect={handlePlantsSelect}
              name="plants"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import styles from './CategoryPriorityEditor.module.css';

export type CategoryPriority = 'must_have' | 'important' | 'nice_to_have' | 'skip';
export type CategorySpendStyle = 'save' | 'balanced' | 'splurge';

export interface CategoryBudgetSetting {
  priority: CategoryPriority;
  spendStyle: CategorySpendStyle;
}

interface CategoryDefinition {
  id: string;
  label: string;
  description?: string;
}

interface CategoryPriorityEditorProps {
  categories: CategoryDefinition[];
  values: Record<string, CategoryBudgetSetting>;
  onChange: (categoryId: string, value: CategoryBudgetSetting) => void;
}

const priorityOptions: Array<{ id: CategoryPriority; label: string }> = [
  { id: 'must_have', label: 'Must-have' },
  { id: 'important', label: 'Important' },
  { id: 'nice_to_have', label: 'Nice-to-have' },
  { id: 'skip', label: 'Skip for now' }
];

const spendOptions: Array<{ id: CategorySpendStyle; label: string }> = [
  { id: 'save', label: 'Save' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'splurge', label: 'Splurge' }
];

export default function CategoryPriorityEditor({ categories, values, onChange }: CategoryPriorityEditorProps) {
  const handleUpdate = (categoryId: string, partial: Partial<CategoryBudgetSetting>) => {
    const currentValue = values[categoryId] || { priority: 'important', spendStyle: 'balanced' };
    onChange(categoryId, { ...currentValue, ...partial });
  };

  return (
    <div className={styles.categoryGrid}>
      {categories.map((category) => {
        const categoryValue = values[category.id] || { priority: 'important', spendStyle: 'balanced' };
        return (
          <div key={category.id} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <p className={styles.categoryTitle}>{category.label}</p>
              {category.description && <p className={styles.categoryDescription}>{category.description}</p>}
            </div>
            <div className={styles.categoryControls}>
              <div className={styles.controlGroup}>
                <p className={styles.controlLabel}>Priority</p>
                <div className={styles.chipGroup}>
                  {priorityOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${styles.chip} ${categoryValue.priority === option.id ? styles.chipActive : ''}`}
                      onClick={() => handleUpdate(category.id, { priority: option.id })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.controlGroup}>
                <p className={styles.controlLabel}>Spend style</p>
                <div className={styles.chipGroup}>
                  {spendOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${styles.chip} ${categoryValue.spendStyle === option.id ? styles.chipActive : ''}`}
                      onClick={() => handleUpdate(category.id, { spendStyle: option.id })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

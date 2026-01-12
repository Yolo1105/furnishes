'use client';

import React from 'react';
import styles from './GoalSelection.module.css';

interface GoalOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  hoverInfo: string[];
}

interface ChallengeOption {
  id: string;
  label: string;
}

interface GoalSelectionProps {
  selectedGoal: string | null;
  selectedChallenge: string | null;
  onGoalSelect: (goal: string) => void;
  onChallengeSelect: (challenge: string) => void;
}

const goalOptions: GoalOption[] = [
  {
    id: 'calm',
    icon: '',
    title: 'Calm',
    subtitle: 'recover',
    hoverInfo: ['Soft, low-contrast colors', 'Minimal visual clutter', 'Natural materials', 'Layered, warm lighting']
  },
  {
    id: 'focus',
    icon: '',
    title: 'Focus',
    subtitle: 'produce',
    hoverInfo: ['Clean lines', 'Organized spaces', 'Minimal distractions', 'Functional design']
  },
  {
    id: 'cozy',
    icon: '',
    title: 'Cozy',
    subtitle: 'safe',
    hoverInfo: ['Warm tones', 'Soft textures', 'Comfortable seating', 'Layered fabrics']
  },
  {
    id: 'social',
    icon: '',
    title: 'Social',
    subtitle: 'connect',
    hoverInfo: ['Conversation areas', 'Flexible seating', 'Accent colors', 'Open layouts']
  }
];

const challengeOptions: ChallengeOption[] = [
  { id: 'clutter', label: 'Visual clutter and chaos' },
  { id: 'lighting', label: 'Poor lighting affecting mood' },
  { id: 'rest', label: "Can't relax or rest well" },
  { id: 'distractions', label: 'Too many distractions' }
];

export default function GoalSelection({
  selectedGoal,
  selectedChallenge,
  onGoalSelect,
  onChallengeSelect
}: GoalSelectionProps) {
  const [hoveredGoal, setHoveredGoal] = React.useState<string | null>(null);

  return (
    <div className={styles.goalSelection}>
      <div className={styles.section}>
        <h3 className={styles.question}>What should this room help you feel?</h3>
        <div className={styles.goalGrid}>
          {goalOptions.map((goal) => (
            <div key={goal.id} className={styles.goalCardWrapper}>
              <button
                className={`${styles.goalCard} ${selectedGoal === goal.id ? styles.selected : ''}`}
                onClick={() => onGoalSelect(goal.id)}
                onMouseEnter={() => setHoveredGoal(goal.id)}
                onMouseLeave={() => setHoveredGoal(null)}
              >
                {goal.icon && <div className={styles.goalIcon}>{goal.icon}</div>}
                <div className={styles.goalTitle}>{goal.title}</div>
                <div className={styles.goalSubtitle}>{goal.subtitle}</div>
                {selectedGoal === goal.id && (
                  <div className={styles.checkmark}>Selected</div>
                )}
              </button>
              {hoveredGoal === goal.id && (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipTitle}>{goal.title} spaces feature:</div>
                  <ul className={styles.tooltipList}>
                    {goal.hoverInfo.map((info, idx) => (
                      <li key={idx}>{info}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.question}>What's your biggest challenge at home?</h3>
        <div className={styles.challengeList}>
          {challengeOptions.map((challenge) => (
            <label key={challenge.id} className={styles.challengeOption}>
              <input
                type="radio"
                name="challenge"
                value={challenge.id}
                checked={selectedChallenge === challenge.id}
                onChange={() => onChallengeSelect(challenge.id)}
              />
              <span>{challenge.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

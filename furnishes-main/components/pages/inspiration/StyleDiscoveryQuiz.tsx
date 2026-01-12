'use client';

import React, { useEffect } from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import QuizHeader from './QuizHeader';
import QuizFooter from './QuizFooter';
import WelcomePage from './pages/WelcomePage';
import FirstFeelingPage from './pages/FirstFeelingPage';
import MoodWordsPage from './pages/MoodWordsPage';
import MorningScenePage from './pages/MorningScenePage';
import QuickFirePage from './pages/QuickFirePage';
import ColorFeelingPage from './pages/ColorFeelingPage';
import TextureTouchPage from './pages/TextureTouchPage';
import FurnitureStylePage from './pages/FurnitureStylePage';
import LifeRealityPage from './pages/LifeRealityPage';
import SpaceStrugglesPage from './pages/SpaceStrugglesPage';
import WellnessGoalPage from './pages/WellnessGoalPage';
import FinalChoicePage from './pages/FinalChoicePage';
import ResultsPage from './pages/ResultsPage';
import styles from './StyleDiscoveryQuiz.module.css';
import { quickChoices } from '@/data/style-discovery-data';

export default function StyleDiscoveryQuiz() {
  const { state, nextPage, calculateResult } = useStyleDiscovery();

  // Check if we can continue to next page
  const canContinue = () => {
    switch (state.currentPage) {
      case 0: // Welcome
        return true;
      case 1: // First Feeling
        return (state.answers['page-1'] as string[])?.length >= 2;
      case 2: // Mood Words
        return (state.answers['page-2'] as string[])?.length >= 4;
      case 3: // Morning Scene
        return !!state.answers['page-3'];
      case 4: // Quick Fire
        return (state.answers['page-4'] as string[])?.length === quickChoices.length;
      case 5: // Color Feeling
        return !!state.answers['page-5'];
      case 6: // Texture Touch
        return (state.answers['page-6'] as string[])?.length === 3;
      case 7: // Furniture Style
        return Object.keys(state.answers['page-7'] || {}).length > 0;
      case 8: // Life Reality
        const page8 = state.answers['page-8'] as any;
        return page8?.organization && page8?.homeLife && page8?.plants;
      case 9: // Space Struggles
        return true; // Optional, can be empty
      case 10: // Wellness Goal
        return !!state.answers['page-10'];
      case 11: // Final Choice
        return !!state.answers['page-11'];
      case 12: // Results
        return false;
      default:
        return false;
    }
  };

  const handleContinue = () => {
    if (state.currentPage === 11) {
      // Last question, calculate result and go to results
      calculateResult();
      nextPage();
    } else {
      nextPage();
    }
  };

  const renderPage = () => {
    switch (state.currentPage) {
      case 0:
        return <WelcomePage />;
      case 1:
        return <FirstFeelingPage />;
      case 2:
        return <MoodWordsPage />;
      case 3:
        return <MorningScenePage />;
      case 4:
        return <QuickFirePage />;
      case 5:
        return <ColorFeelingPage />;
      case 6:
        return <TextureTouchPage />;
      case 7:
        return <FurnitureStylePage />;
      case 8:
        return <LifeRealityPage />;
      case 9:
        return <SpaceStrugglesPage />;
      case 10:
        return <WellnessGoalPage />;
      case 11:
        return <FinalChoicePage />;
      case 12:
        return <ResultsPage />;
      default:
        return <WelcomePage />;
    }
  };

  const getContinueLabel = () => {
    if (state.currentPage === 0) {
      return 'Begin';
    }
    if (state.currentPage === 11) {
      return 'See Results';
    }
    return 'Continue';
  };

  return (
    <div className={styles.quizContainer}>
      <QuizHeader showPageNumber={state.currentPage > 0} />
      <div className={styles.content}>
        <div className={styles.pageWrapper}>{renderPage()}</div>
      </div>
      <QuizFooter
        onContinue={handleContinue}
        canContinue={canContinue()}
        continueLabel={getContinueLabel()}
      />
    </div>
  );
}

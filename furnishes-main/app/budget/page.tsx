'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import { BUDGET } from '@/constants/business';
import styles from './BudgetPage.module.css';

type Mode = 'direct' | 'guided' | null;
type Strictness = 'hard' | 'flexible';
type Priority = 'must-have' | 'important' | 'nice-to-have' | 'skip';
type Spend = 'save' | 'balanced' | 'splurge';

interface CategoryData {
  priority: Priority;
  spend: Spend;
}

interface Questions {
  room: string | null;
  size: string | null;
  scope: string | null;
  duration: string | null;
  quality: string | null;
  style: string | null;
}

const catNames: Record<string, string> = {
  seating: 'Seating & Sofa',
  storage: 'Storage & Media',
  lighting: 'Lighting',
  decor: 'Rug & Decor',
  tables: 'Tables'
};

export default function BudgetPage() {
  const router = useRouter();
  const { setBudgetPlan } = useProject();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [mode, setMode] = useState<Mode>(null);
  const [budget, setBudget] = useState(0);
  const [strictness, setStrictness] = useState<Strictness>('hard');
  const [questions, setQuestions] = useState<Questions>({
    room: null,
    size: null,
    scope: null,
    duration: null,
    quality: null,
    style: null
  });
  const [categories, setCategories] = useState<Record<string, CategoryData>>({
    seating: { priority: 'must-have', spend: 'splurge' },
    storage: { priority: 'important', spend: 'balanced' },
    lighting: { priority: 'important', spend: 'balanced' },
    decor: { priority: 'important', spend: 'balanced' },
    tables: { priority: 'important', spend: 'balanced' }
  });
  const [recRange, setRecRange] = useState({ min: 4000, max: 12000, mid: 7500 });
  const [recSliderValue, setRecSliderValue] = useState(7500);
  const [guardrailsOpen, setGuardrailsOpen] = useState(false);

  // Calculate allocations
  const allocations = useMemo(() => {
    const pW: Record<Priority, number> = { 'must-have': 2, 'important': 1.2, 'nice-to-have': 0.5, 'skip': 0 };
    const sW: Record<Spend, number> = { 'splurge': 1.5, 'balanced': 1, 'save': 0.6 };

    let total = 0;
    const weights: Record<string, number> = {};
    for (const [cat, data] of Object.entries(categories)) {
      const w = pW[data.priority] * sW[data.spend];
      weights[cat] = w;
      total += w;
    }

    const result: Record<string, { pct: number; amount: number }> = {};
    for (const [cat, w] of Object.entries(weights)) {
      const pct = total > 0 ? Math.round((w / total) * 100) : 0;
      result[cat] = { pct, amount: Math.round((pct / 100) * budget) };
    }
    return result;
  }, [categories, budget]);

  // Navigation
  const canProceed = () => {
    if (currentStep === 1) {
      // In intro view, can't proceed until mode is selected
      if (!mode) return false;
      // In direct mode, need budget >= 1000
      if (mode === 'direct') return budget >= 1000;
      // In guided mode, need all questions answered and budget set
      if (mode === 'guided') {
        const { room, size, scope, duration, quality, style } = questions;
        return !!(room && size && scope && duration && quality && style && budget >= 1000);
      }
    }
    return true;
  };

  const goToStep = (step: number) => {
    const maxReached = Math.max(...completedSteps, 0);
    if (step > maxReached + 1 && step > currentStep) return;
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const goNext = () => {
    if (!canProceed()) return;
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    } else {
      // Save plan
      const plan = {
        total: budget,
        strictness: strictness === 'hard' ? 'hard_cap' : 'flexible',
        allocations: Object.entries(allocations).map(([id, data]) => ({
          category: id,
          amount: data.amount,
          percent: data.pct
        }))
      };
      setBudgetPlan(plan);
      router.push('/room-planner');
    }
  };

  const goBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  // Step 1 handlers
  const showIntro = () => {
    setMode(null);
    setBudget(0);
    setQuestions({ room: null, size: null, scope: null, duration: null, quality: null, style: null });
  };

  const showForm = (formMode: 'direct' | 'guided') => {
    setMode(formMode);
  };

  const handleBudgetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(val) || 0;
    setBudget(num);
    e.target.value = val ? parseInt(val).toLocaleString() : '';
  };

  const setPreset = (amount: number) => {
    setBudget(amount);
    const input = document.getElementById('budgetField') as HTMLInputElement;
    if (input) input.value = amount.toLocaleString();
  };

  const calculateRecommendation = (q: Questions) => {
    const { room, size, scope, duration, quality, style } = q;
    
    const roomBase: Record<string, number> = {
      living: 7000,
      bedroom: 5000,
      office: 4000,
      dining: 6000,
      studio: 6500
    };
    let base = roomBase[room || 'living'] || 6000;

    if (size === 'small') base *= 0.75;
    else if (size === 'large') base *= 1.35;

    if (scope === 'empty') base *= 1.2;
    else if (scope === 'few') base *= 0.5;

    if (duration === 'short') base *= 0.7;
    else if (duration === 'long') base *= 1.2;

    if (quality === 'budget') base *= 0.6;
    else if (quality === 'high') base *= 1.6;

    if (style === 'hunter') base *= 0.8;
    else if (style === 'convenience') base *= 1.15;

    const min = Math.round(base * 0.75 / 500) * 500;
    const max = Math.round(base * 1.25 / 500) * 500;
    const mid = Math.round(base / 500) * 500;

    setRecRange({ min, max, mid });
    setRecSliderValue(mid);
    setBudget(mid);
  };

  const setQuestion = (key: keyof Questions, value: string) => {
    setQuestions(prev => {
      const updated = { ...prev, [key]: value };
      // Check if all questions are answered after update
      if (updated.room && updated.size && updated.scope && updated.duration && updated.quality && updated.style) {
        calculateRecommendation(updated);
      }
      return updated;
    });
  };

  const handleRecSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setRecSliderValue(val);
    setBudget(val);
  };

  const setStrictnessOption = (type: Strictness) => {
    setStrictness(type);
  };

  // Step 2 & 3 handlers
  const setPriority = (cat: string, priority: Priority) => {
    setCategories(prev => ({
      ...prev,
      [cat]: { ...prev[cat], priority }
    }));
  };

  const setSpend = (cat: string, spend: Spend) => {
    setCategories(prev => ({
      ...prev,
      [cat]: { ...prev[cat], spend }
    }));
  };

  // Progress calculation
  const progressFill = (completedSteps.length / 4) * 100;
  const showSidebar = currentStep >= 2;

  return (
    <div className={styles.app}>
      {/* Progress Header */}
      <header className={styles.progressHeader}>
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div className={styles.progressTrackFill} style={{ width: `${progressFill}%` }}></div>
          </div>
          <div className={styles.progressSteps}>
            {[1, 2, 3, 4].map((step) => {
              const isActive = currentStep === step;
              const isCompleted = completedSteps.includes(step);
              const isDisabled = step > Math.max(...completedSteps, 0) + 1;
              const isClickable = !isDisabled && (isCompleted || step <= currentStep);

              return (
                <div
                  key={step}
                  className={`${styles.progressStep} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${isDisabled ? styles.disabled : ''} ${isClickable ? styles.clickable : ''}`}
                  onClick={() => isClickable && goToStep(step)}
                >
                  <div className={styles.progressCircle}>{step}</div>
                  <span className={styles.progressLabel}>
                    {step === 1 ? 'Budget' : step === 2 ? 'Priorities' : step === 3 ? 'Spend Style' : 'Review'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className={styles.appBody}>
        <main className={styles.main}>
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
            {/* STEP 1: Budget */}
            <div className={`${styles.stepPanel} ${currentStep === 1 ? styles.active : ''}`} data-step="1">
              <div className={`${styles.contentInner} ${styles.narrow}`}>
                {/* Intro View */}
                {!mode && (
                  <div id="budgetIntro">
                    <div className={`${styles.stepHeader} ${styles.center}`}>
                      <h1 className={styles.stepTitle}>What's your budget?</h1>
                      <p className={styles.stepSubtitle}>Once we know your total, we'll help you split it across furniture categories based on what matters most to you.</p>
                    </div>

                    <div className={styles.introCard}>
                      <div className={styles.introTitle}>Here's what we'll do:</div>
                      <ul className={styles.introList}>
                        <li>Set your total budget</li>
                        <li>Rank which categories matter most to you</li>
                        <li>Choose where to save vs splurge</li>
                        <li>Get a personalized spending breakdown</li>
                      </ul>
                    </div>

                    <div className={styles.entrySection}>
                      <div className={styles.entryCards}>
                        <div className={styles.entryCard} onClick={() => showForm('direct')}>
                          <div className={styles.entryCardIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="1" x2="12" y2="23"></line>
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                          </div>
                          <div className={styles.entryCardTitle}>I know my budget</div>
                          <div className={styles.entryCardDesc}>I have a specific amount in mind — let's figure out how to spend it wisely across categories.</div>
                          <div className={styles.entryCardExample}>e.g., "I have $8,000 to spend"</div>
                        </div>
                        <div className={styles.entryCard} onClick={() => showForm('guided')}>
                          <div className={styles.entryCardIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <div className={styles.entryCardTitle}>Help me decide</div>
                          <div className={styles.entryCardDesc}>I'm not sure what's reasonable to spend. Help me find the right budget based on my room and goals.</div>
                          <div className={styles.entryCardExample}>4 quick questions → personalized range</div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons - Only for intro view */}
                    <div className={styles.navigationButtons}>
                      <div></div>
                      <div></div>
                      <button 
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                        onClick={goNext}
                        disabled={!canProceed()}
                      >
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct Input Form */}
                {mode === 'direct' && (
                  <div className={`${styles.formSection} ${styles.active}`}>
                    <div className={styles.backLink} onClick={showIntro}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      Back
                    </div>

                    <div className={styles.stepHeader}>
                      <h1 className={styles.stepTitle}>Enter your budget</h1>
                      <p className={styles.stepSubtitle}>How much do you want to spend on this room total?</p>
                    </div>

                    <div className={styles.budgetInputCard}>
                      <div className={styles.budgetInputRow}>
                        <span className={styles.budgetSymbol}>$</span>
                        <input
                          type="text"
                          className={styles.budgetField}
                          id="budgetField"
                          placeholder="0"
                          onChange={handleBudgetInput}
                        />
                      </div>
                      <div className={styles.budgetPresets}>
                        {BUDGET.PRESETS.map((preset) => (
                          <button 
                            key={preset}
                            className={styles.budgetPreset} 
                            onClick={() => setPreset(preset)}
                          >
                            ${preset.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.sectionCard}>
                      <div className={styles.sectionLabel}>HOW STRICT IS THIS?</div>
                      <div className={styles.strictnessOptions}>
                        <div className={`${styles.strictnessOption} ${strictness === 'hard' ? styles.selected : ''}`} onClick={() => setStrictnessOption('hard')}>
                          <div className={styles.strictnessRadio}>
                            <div className={styles.strictnessDot}></div>
                          </div>
                          <div>
                            <div className={styles.strictnessTitle}>Hard cap</div>
                            <div className={styles.strictnessDesc}>I won't go over this amount</div>
                          </div>
                        </div>
                        <div className={`${styles.strictnessOption} ${strictness === 'flexible' ? styles.selected : ''}`} onClick={() => setStrictnessOption('flexible')}>
                          <div className={styles.strictnessRadio}>
                            <div className={styles.strictnessDot}></div>
                          </div>
                          <div>
                            <div className={styles.strictnessTitle}>Flexible</div>
                            <div className={styles.strictnessDesc}>Can stretch 10-15% for the right piece</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons for Direct Form */}
                    <div className={styles.navigationButtons}>
                      <button 
                        className={`${styles.btn} ${styles.btnGhost}`} 
                        onClick={showIntro}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Back
                      </button>
                      <div></div>
                      <button 
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                        onClick={goNext}
                        disabled={!canProceed()}
                      >
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Guided Questions Form */}
                {mode === 'guided' && (
                  <div className={`${styles.formSection} ${styles.active}`}>
                    <div className={styles.backLink} onClick={showIntro}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      Back
                    </div>

                    <div className={styles.stepHeader}>
                      <h1 className={styles.stepTitle}>Let's find your budget</h1>
                      <p className={styles.stepSubtitle}>Answer a few quick questions and we'll recommend a realistic range for your situation.</p>
                    </div>

                    {/* Question 1 */}
                    <div className={styles.questionCard}>
                      <div className={styles.questionNum}>1 of 6</div>
                      <div className={styles.questionLabel}>What room are you furnishing?</div>
                      <div className={styles.questionOptions}>
                        <button className={`${styles.questionOption} ${questions.room === 'living' ? styles.selected : ''}`} onClick={() => setQuestion('room', 'living')}>
                          <span className={styles.optionTitle}>Living room</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.room === 'bedroom' ? styles.selected : ''}`} onClick={() => setQuestion('room', 'bedroom')}>
                          <span className={styles.optionTitle}>Bedroom</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.room === 'office' ? styles.selected : ''}`} onClick={() => setQuestion('room', 'office')}>
                          <span className={styles.optionTitle}>Home office</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.room === 'dining' ? styles.selected : ''}`} onClick={() => setQuestion('room', 'dining')}>
                          <span className={styles.optionTitle}>Dining room</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.room === 'studio' ? styles.selected : ''}`} onClick={() => setQuestion('room', 'studio')}>
                          <span className={styles.optionTitle}>Studio / Multi-use</span>
                        </button>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className={styles.questionCard}>
                      <div className={styles.questionNum}>2 of 6</div>
                      <div className={styles.questionLabel}>How big is the space?</div>
                      <div className={styles.questionHint}>This helps us estimate how many pieces you'll need.</div>
                      <div className={styles.questionOptions}>
                        <button className={`${styles.questionOption} ${questions.size === 'small' ? styles.selected : ''}`} onClick={() => setQuestion('size', 'small')}>
                          <span className={styles.optionTitle}>Cozy</span>
                          <span className={styles.optionDesc}>Apartment-sized, under 200 sq ft</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.size === 'medium' ? styles.selected : ''}`} onClick={() => setQuestion('size', 'medium')}>
                          <span className={styles.optionTitle}>Medium</span>
                          <span className={styles.optionDesc}>Average room, 200-400 sq ft</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.size === 'large' ? styles.selected : ''}`} onClick={() => setQuestion('size', 'large')}>
                          <span className={styles.optionTitle}>Spacious</span>
                          <span className={styles.optionDesc}>Large or open plan, 400+ sq ft</span>
                        </button>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className={styles.questionCard}>
                      <div className={styles.questionNum}>3 of 6</div>
                      <div className={styles.questionLabel}>What's your starting point?</div>
                      <div className={styles.questionOptions}>
                        <button className={`${styles.questionOption} ${questions.scope === 'empty' ? styles.selected : ''}`} onClick={() => setQuestion('scope', 'empty')}>
                          <span className={styles.optionTitle}>Empty room</span>
                          <span className={styles.optionDesc}>Starting completely from scratch</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.scope === 'some' ? styles.selected : ''}`} onClick={() => setQuestion('scope', 'some')}>
                          <span className={styles.optionTitle}>Have some pieces</span>
                          <span className={styles.optionDesc}>Keeping a few things, replacing the rest</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.scope === 'few' ? styles.selected : ''}`} onClick={() => setQuestion('scope', 'few')}>
                          <span className={styles.optionTitle}>Just a few items</span>
                          <span className={styles.optionDesc}>Only need 1-3 key pieces</span>
                        </button>
                      </div>
                    </div>

                    {/* Question 4 */}
                    <div className={styles.questionCard}>
                      <div className={styles.questionNum}>4 of 6</div>
                      <div className={styles.questionLabel}>How long do you plan to keep this furniture?</div>
                      <div className={styles.questionHint}>This affects whether to invest in durability.</div>
                      <div className={styles.questionOptions}>
                        <button className={`${styles.questionOption} ${questions.duration === 'short' ? styles.selected : ''}`} onClick={() => setQuestion('duration', 'short')}>
                          <span className={styles.optionTitle}>1-2 years</span>
                          <span className={styles.optionDesc}>Temporary setup, might move soon</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.duration === 'medium' ? styles.selected : ''}`} onClick={() => setQuestion('duration', 'medium')}>
                          <span className={styles.optionTitle}>3-5 years</span>
                          <span className={styles.optionDesc}>Settled for now, may upgrade later</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.duration === 'long' ? styles.selected : ''}`} onClick={() => setQuestion('duration', 'long')}>
                          <span className={styles.optionTitle}>5+ years</span>
                          <span className={styles.optionDesc}>Want pieces that last</span>
                        </button>
                      </div>
                    </div>

                    {/* Question 5 */}
                    <div className={styles.questionCard}>
                      <div className={styles.questionNum}>5 of 6</div>
                      <div className={styles.questionLabel}>What quality level are you aiming for?</div>
                      <div className={styles.questionOptions}>
                        <button className={`${styles.questionOption} ${questions.quality === 'budget' ? styles.selected : ''}`} onClick={() => setQuestion('quality', 'budget')}>
                          <span className={styles.optionTitle}>Budget-friendly</span>
                          <span className={styles.optionDesc}>IKEA, Wayfair, Target — functional and affordable</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.quality === 'mid' ? styles.selected : ''}`} onClick={() => setQuestion('quality', 'mid')}>
                          <span className={styles.optionTitle}>Mid-range</span>
                          <span className={styles.optionDesc}>West Elm, CB2, Article — quality at fair prices</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.quality === 'high' ? styles.selected : ''}`} onClick={() => setQuestion('quality', 'high')}>
                          <span className={styles.optionTitle}>Investment pieces</span>
                          <span className={styles.optionDesc}>Room & Board, Design Within Reach — buy once, keep forever</span>
                        </button>
                      </div>
                    </div>

                    {/* Question 6 */}
                    <div className={styles.questionCard}>
                      <div className={styles.questionNum}>6 of 6</div>
                      <div className={styles.questionLabel}>How do you like to shop?</div>
                      <div className={styles.questionHint}>This helps us set realistic expectations.</div>
                      <div className={styles.questionOptions}>
                        <button className={`${styles.questionOption} ${questions.style === 'hunter' ? styles.selected : ''}`} onClick={() => setQuestion('style', 'hunter')}>
                          <span className={styles.optionTitle}>Deal hunter</span>
                          <span className={styles.optionDesc}>I'll wait for sales, buy secondhand, mix and match</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.style === 'balanced' ? styles.selected : ''}`} onClick={() => setQuestion('style', 'balanced')}>
                          <span className={styles.optionTitle}>Balanced</span>
                          <span className={styles.optionDesc}>Some deals, some full price — depends on the piece</span>
                        </button>
                        <button className={`${styles.questionOption} ${questions.style === 'convenience' ? styles.selected : ''}`} onClick={() => setQuestion('style', 'convenience')}>
                          <span className={styles.optionTitle}>Convenience first</span>
                          <span className={styles.optionDesc}>I'd rather pay more and get it done quickly</span>
                        </button>
                      </div>
                    </div>

                    {/* Recommendation Card */}
                    {questions.room && questions.size && questions.scope && questions.duration && questions.quality && questions.style && (
                      <div className={`${styles.recommendationCard} ${styles.visible}`}>
                        <div className={styles.recommendationLabel}>Based on your answers, we recommend</div>
                        <div className={styles.recommendationRange}>
                          ${recRange.min.toLocaleString()} – ${recRange.max.toLocaleString()}
                        </div>
                        <div className={styles.recommendationNote}>This range accounts for your room size, quality preferences, and shopping style.</div>

                        <div className={styles.recommendationSlider}>
                          <div className={styles.recSliderLabel}>Adjust to your comfort level</div>
                          <div className={styles.recSliderTrack}>
                            <div className={styles.recSliderFill} style={{ width: `${((recSliderValue - recRange.min) / (recRange.max - recRange.min)) * 100}%` }}></div>
                            <input
                              type="range"
                              className={styles.recSliderInput}
                              min={recRange.min}
                              max={recRange.max}
                              value={recSliderValue}
                              step="500"
                              onChange={handleRecSlider}
                            />
                            <div className={styles.recSliderThumb} style={{ left: `${((recSliderValue - recRange.min) / (recRange.max - recRange.min)) * 100}%` }}></div>
                          </div>
                          <div className={styles.recSliderLabels}>
                            <span>${recRange.min.toLocaleString()}</span>
                            <span>${recRange.max.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className={styles.recFinalValue}>
                          <div className={styles.recFinalLabel}>Your budget</div>
                          <div className={styles.recFinalAmount}>${recSliderValue.toLocaleString()}</div>
                        </div>
                      </div>
                    )}

                    {/* Strictness for Guided */}
                    {questions.room && questions.size && questions.scope && questions.duration && questions.quality && questions.style && (
                      <div className={styles.sectionCard} style={{ marginTop: '24px' }}>
                        <div className={styles.sectionLabel}>HOW STRICT IS THIS?</div>
                        <div className={styles.strictnessOptions}>
                          <div className={`${styles.strictnessOption} ${strictness === 'hard' ? styles.selected : ''}`} onClick={() => setStrictnessOption('hard')}>
                            <div className={styles.strictnessRadio}>
                              <div className={styles.strictnessDot}></div>
                            </div>
                            <div>
                              <div className={styles.strictnessTitle}>Hard cap</div>
                              <div className={styles.strictnessDesc}>I won't go over this amount</div>
                            </div>
                          </div>
                          <div className={`${styles.strictnessOption} ${strictness === 'flexible' ? styles.selected : ''}`} onClick={() => setStrictnessOption('flexible')}>
                            <div className={styles.strictnessRadio}>
                              <div className={styles.strictnessDot}></div>
                            </div>
                            <div>
                              <div className={styles.strictnessTitle}>Flexible</div>
                              <div className={styles.strictnessDesc}>Can stretch 10-15% for the right piece</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons for Guided Form */}
                    <div className={styles.navigationButtons}>
                      <button 
                        className={`${styles.btn} ${styles.btnGhost}`} 
                        onClick={showIntro}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Back
                      </button>
                      <div></div>
                      <button 
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                        onClick={goNext}
                        disabled={!canProceed()}
                      >
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: Priorities */}
            <div className={`${styles.stepPanel} ${currentStep === 2 ? styles.active : ''}`} data-step="2">
              <div className={styles.contentInner}>
                <div className={styles.stepHeader}>
                  <h1 className={styles.stepTitle}>What matters most?</h1>
                  <p className={styles.stepSubtitle}>Rank each category so we can allocate more budget to what you care about.</p>
                </div>

                {Object.entries(catNames).map(([cat, name]) => (
                  <div key={cat} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                      <div>
                        <div className={styles.categoryName}>{name}</div>
                        <div className={styles.categoryDesc}>
                          {cat === 'seating' ? 'Main seating pieces' :
                           cat === 'storage' ? 'Shelves, cabinets, TV stand' :
                           cat === 'lighting' ? 'Lamps and fixtures' :
                           cat === 'decor' ? 'Rugs, art, pillows' :
                           'Coffee, side, dining'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.chips}>
                      <button className={`${styles.chip} ${categories[cat].priority === 'must-have' ? styles.selected : ''}`} onClick={() => setPriority(cat, 'must-have')}>
                        Must-have
                      </button>
                      <button className={`${styles.chip} ${categories[cat].priority === 'important' ? styles.selected : ''}`} onClick={() => setPriority(cat, 'important')}>
                        Important
                      </button>
                      <button className={`${styles.chip} ${categories[cat].priority === 'nice-to-have' ? styles.selected : ''}`} onClick={() => setPriority(cat, 'nice-to-have')}>
                        Nice-to-have
                      </button>
                      <button className={`${styles.chip} ${categories[cat].priority === 'skip' ? styles.selected : ''}`} onClick={() => setPriority(cat, 'skip')}>
                        Skip
                      </button>
                    </div>
                  </div>
                ))}

                {/* Navigation Buttons for Step 2 */}
                <div className={styles.navigationButtons}>
                  <button 
                    className={`${styles.btn} ${styles.btnGhost}`} 
                    onClick={goBack}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back
                  </button>
                  <div></div>
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                    onClick={goNext}
                    disabled={!canProceed()}
                  >
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3: Spend Style */}
            <div className={`${styles.stepPanel} ${currentStep === 3 ? styles.active : ''}`} data-step="3">
              <div className={styles.contentInner}>
                <div className={styles.stepHeader}>
                  <h1 className={styles.stepTitle}>Where to save or splurge?</h1>
                  <p className={styles.stepSubtitle}>For each category, choose your spending approach.</p>
                </div>

                {Object.entries(catNames).map(([cat, name]) => {
                  const fmtPriority = (p: Priority) => p.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('-');
                  return (
                    <div key={cat} className={styles.categoryCard}>
                      <div className={styles.categoryHeader}>
                        <div className={styles.categoryName}>{name}</div>
                        <span className={styles.categoryBadge}>{fmtPriority(categories[cat].priority)}</span>
                      </div>
                      <div className={styles.chips}>
                        <button className={`${styles.chip} ${categories[cat].spend === 'save' ? styles.selected : ''}`} onClick={() => setSpend(cat, 'save')}>
                          Save
                        </button>
                        <button className={`${styles.chip} ${categories[cat].spend === 'balanced' ? styles.selected : ''}`} onClick={() => setSpend(cat, 'balanced')}>
                          Balanced
                        </button>
                        <button className={`${styles.chip} ${categories[cat].spend === 'splurge' ? styles.selected : ''}`} onClick={() => setSpend(cat, 'splurge')}>
                          Splurge
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Navigation Buttons for Step 3 */}
                <div className={styles.navigationButtons}>
                  <button 
                    className={`${styles.btn} ${styles.btnGhost}`} 
                    onClick={goBack}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back
                  </button>
                  <div></div>
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                    onClick={goNext}
                    disabled={!canProceed()}
                  >
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 4: Review */}
            <div className={`${styles.stepPanel} ${currentStep === 4 ? styles.active : ''}`} data-step="4">
              <div className={styles.contentInner}>
                <div className={styles.stepHeader}>
                  <h1 className={styles.stepTitle}>Your budget plan</h1>
                  <p className={styles.stepSubtitle}>Here's how we recommend allocating your spending.</p>
                </div>

                <div className={styles.reviewHero}>
                  <div className={styles.reviewHeroLabel}>Total Budget</div>
                  <div className={styles.reviewHeroAmount}>${budget.toLocaleString()}</div>
                  <div className={styles.reviewHeroMeta}>{strictness === 'hard' ? 'Hard cap' : 'Flexible (+10-15%)'}</div>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHeader}>
                    <span className={styles.reviewSectionTitle}>ALLOCATION</span>
                    <button className={styles.reviewSectionEdit} onClick={() => goToStep(2)}>Edit</button>
                  </div>
                  <div className={styles.reviewSectionBody}>
                    <div className={styles.allocationBar}>
                      {Object.entries(allocations).map(([cat, data]) => (
                        <div key={cat} className={`${styles.allocationSeg} ${styles[cat]}`} style={{ width: `${data.pct}%` }}></div>
                      ))}
                    </div>
                    <div>
                      {Object.entries(allocations).map(([cat, data]) => {
                        const fmtPriority = (p: Priority) => p.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('-');
                        const fmtSpend = (s: Spend) => s[0].toUpperCase() + s.slice(1);
                        return (
                          <div key={cat} className={styles.allocationRow}>
                            <div className={styles.allocationLeft}>
                              <div className={`${styles.allocationDot} ${styles[cat]}`}></div>
                              <span className={styles.allocationName}>{catNames[cat]}</span>
                              <div className={styles.allocationTags}>
                                <span className={styles.allocationTag}>{fmtPriority(categories[cat].priority)}</span>
                                <span className={styles.allocationTag}>{fmtSpend(categories[cat].spend)}</span>
                              </div>
                            </div>
                            <span className={styles.allocationAmount}>${data.amount.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={styles.guardrailsSection}>
                  <button className={`${styles.guardrailsToggle} ${guardrailsOpen ? styles.open : ''}`} onClick={() => setGuardrailsOpen(!guardrailsOpen)}>
                    <span className={styles.guardrailsToggleText}>Optional: Add spending rules</span>
                    <svg className={styles.guardrailsToggleIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {guardrailsOpen && (
                    <div className={`${styles.guardrailsContent} ${styles.open}`}>
                      <div className={styles.guardrailRow}>
                        <label className={styles.checkboxWrap}>
                          <input type="checkbox" className={styles.checkboxInput} defaultChecked />
                          <span className={styles.checkboxBox}></span>
                        </label>
                        <span className={styles.guardrailText}>Cap any category at</span>
                        <input type="number" className={styles.guardrailNum} defaultValue={50} />
                        <span className={styles.guardrailText}>%</span>
                      </div>
                      <div className={styles.guardrailRow}>
                        <label className={styles.checkboxWrap}>
                          <input type="checkbox" className={styles.checkboxInput} defaultChecked />
                          <span className={styles.checkboxBox}></span>
                        </label>
                        <span className={styles.guardrailText}>Reserve at least</span>
                        <input type="number" className={styles.guardrailNum} defaultValue={10} />
                        <span className={styles.guardrailText}>% for decor</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons for Step 4 */}
                <div className={styles.navigationButtons}>
                  <button 
                    className={`${styles.btn} ${styles.btnGhost}`} 
                    onClick={goBack}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back
                  </button>
                  <div></div>
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                    onClick={goNext}
                    disabled={!canProceed()}
                  >
                    Save Plan
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${showSidebar ? '' : styles.hidden}`}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>YOUR BUDGET</div>
            <div className={styles.sidebarBudget}>${budget.toLocaleString()}</div>
            <div className={styles.sidebarBudgetSub}>{strictness === 'hard' ? 'Hard cap' : 'Flexible'}</div>
          </div>

          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>ALLOCATION</div>
            <div className={styles.sidebarBar}>
              {Object.entries(allocations).map(([cat, data]) => (
                <div key={cat} className={`${styles.allocationSeg} ${styles[cat]}`} style={{ width: `${data.pct}%` }}></div>
              ))}
            </div>
            <div>
              {Object.entries(allocations).map(([cat, data]) => (
                <div key={cat} className={styles.sidebarAllocItem}>
                  <div className={styles.sidebarAllocLeft}>
                    <div className={`${styles.allocationDot} ${styles[cat]}`}></div>
                    {catNames[cat]}
                  </div>
                  <span className={styles.sidebarAllocRight}>${data.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

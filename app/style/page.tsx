'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/shared/ui/PageHero';
import StyleModeSelector from '@/components/pages/style/StyleModeSelector';
import GoalSelection from '@/components/pages/style/GoalSelection';
import VisualTasteGrid from '@/components/pages/style/VisualTasteGrid';
import StylePackOutput from '@/components/pages/style/StylePackOutput';
import StyleSummaryPanel from '@/components/pages/style/StyleSummaryPanel';
import StyleTagSelector from '@/components/pages/style/StyleTagSelector';
import StyleDescriptionInput from '@/components/pages/style/StyleDescriptionInput';
import StyleDNASummary from '@/components/pages/style/StyleDNASummary';
import LoadingMoment from '@/components/shared/ui/LoadingMoment';
import { useProject } from '@/contexts/ProjectContext';
import { generateStylePackFromInputs } from '@/utils/stylePackGenerator';
import type { StyleDNAValues } from '@/components/pages/style/StyleDNASliders';
import type { StylePack } from '@/types/project';
import { VALIDATION } from '@/constants/business';
import styles from './StylePage.module.css';

export default function StylePage() {
  const router = useRouter();
  const { state, setStylePack, setStep } = useProject();
  const [mode, setMode] = useState<'known' | 'guided'>('known');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [roomName, setRoomName] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [naturalLight, setNaturalLight] = useState('');
  const [primaryPurpose, setPrimaryPurpose] = useState<string[]>([]);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(!!state.stylePack);
  const [showSummary, setShowSummary] = useState(false);
  const [generatedStylePack, setGeneratedStylePack] = useState<StylePack | null>(null);
  
  // Stage management
  const [currentStage, setCurrentStage] = useState(1); // Start at Room Setup (step 1)
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [maxReachedStage, setMaxReachedStage] = useState(1);
  
  // Known mode state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [primaryStyle, setPrimaryStyle] = useState<string | null>(null);
  const [accents, setAccents] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  // Stage 3: Visual sliders (1-10 scale)
  const [sliderValues, setSliderValues] = useState({
    era: 0,
    density: 0,
    colorIntensity: 0,
    temperature: 0,
    material: 0,
    energy: 0,
    formality: 0
  });
  const [moodKeywords, setMoodKeywords] = useState<string[]>([]);
  const [baseColors, setBaseColors] = useState<string[]>([]);
  const [accentColors, setAccentColors] = useState<string[]>([]);
  const [woodTones, setWoodTones] = useState<string[]>([]);
  const [textures, setTextures] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('');
  const [mustKeep, setMustKeep] = useState<string[]>([]);
  const [hardNos, setHardNos] = useState<string[]>([]);
  const [considerations, setConsiderations] = useState<string[]>([]);
  const [keepInput, setKeepInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');

  // Navigation functions
  const canAccessStage = (stage: number) => {
    if (stage <= maxReachedStage) return true;
    if (stage === currentStage + 1 && completedStages.includes(currentStage)) return true;
    return false;
  };

  const handleProgressClick = (stage: number) => {
    if (canAccessStage(stage)) {
      goToStage(stage);
    }
  };

  const goToStage = (stage: number) => {
    setCurrentStage(stage);
    if (stage > maxReachedStage) {
      setMaxReachedStage(stage);
    }
    window.scrollTo(0, 0);
  };

  const nextStage = () => {
    // Validation for each stage
    if (currentStage === 1 && !roomName) {
      alert('Please select a room type to continue.');
      return;
    }
    if (currentStage === 1 && primaryPurpose.length === 0) {
      alert('Please select at least one primary purpose to continue.');
      return;
    }
    if (currentStage === 2 && !primaryStyle) {
      alert('Please select a primary style to continue.');
      return;
    }
    if (currentStage === 4 && baseColors.length < 2) {
      alert('Please select at least 2 base colors to continue.');
      return;
    }
    if (currentStage === 4 && woodTones.length === 0) {
      alert('Please select at least one wood tone to continue.');
      return;
    }
    if (currentStage === 5 && !budget) {
      alert('Please select a budget range to continue.');
      return;
    }

    if (!completedStages.includes(currentStage)) {
      setCompletedStages([...completedStages, currentStage]);
    }

    if (currentStage < 6) {
      const next = currentStage + 1;
      setCurrentStage(next);
      if (next > maxReachedStage) {
        setMaxReachedStage(next);
      }
      window.scrollTo(0, 0);
    } else {
      // Generate style pack on final step
      handleGenerate();
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleImageToggle = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handlePrimaryStyleSelect = (style: string) => {
    if (primaryStyle === style) {
      // Deselecting
      setPrimaryStyle(null);
      setSelectedStyles([]);
      setAccents([]);
    } else {
      // Selecting new primary
      setPrimaryStyle(style);
      setSelectedStyles([style]);
      setAccents(accents.filter(a => a !== style));
    }
  };

  const handleAccentToggle = (style: string) => {
    if (accents.includes(style)) {
      setAccents(accents.filter(a => a !== style));
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else if (accents.length < 2) {
      setAccents([...accents, style]);
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleRoomSelect = (room: string) => {
    setRoomName(room);
  };

  const handlePurposeToggle = (purpose: string) => {
    setPrimaryPurpose(prev => 
      prev.includes(purpose)
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleUserToggle = (user: string) => {
    setRoomUsers(prev => 
      prev.includes(user)
        ? prev.filter(u => u !== user)
        : [...prev, user]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Generate style pack from wizard inputs
    setTimeout(() => {
      // Create style pack from collected wizard data
      const stylePack = {
        direction: primaryStyle || 'Modern',
        palette: [...baseColors, ...accentColors],
        materials: [...woodTones, ...textures],
        keepRules: mustKeep,
        avoidRules: hardNos,
        evidence: [
          `Room: ${roomName || 'Not specified'}`,
          `Primary Purpose: ${primaryPurpose.join(', ') || 'Not specified'}`,
          `Budget: ${budget || 'Not specified'}`,
          `Style DNA: Era ${sliderValues.era || '—'}, Density ${sliderValues.density || '—'}, Color ${sliderValues.colorIntensity || '—'}`
        ]
      };
      
      setGeneratedStylePack(stylePack);
      setIsGenerating(false);
      setShowSummary(true);
    }, 2000);
  };

  const handleUpdateSummary = () => {
    if (generatedStylePack) {
      setStylePack(generatedStylePack);
      // The summary tab in right sidebar will automatically update via ProjectContext
      // The animation will trigger automatically when state.stylePack changes
      // Show visual feedback on button
      const btn = document.querySelector(`.${styles.summaryActions} .${styles.btnPrimary}`);
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Updated!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    }
  };

  const handleStartOver = () => {
    // Reset all wizard state (but keep right sidebar summary intact)
    setRoomName('');
    setRoomSize('');
    setCeilingHeight('');
    setNaturalLight('');
    setPrimaryPurpose([]);
    setRoomUsers([]);
    setPrimaryStyle(null);
    setAccents([]);
    setDescription('');
    setSliderValues({
      era: 0,
      density: 0,
      colorIntensity: 0,
      temperature: 0,
      material: 0,
      energy: 0,
      formality: 0
    });
    setMoodKeywords([]);
    setBaseColors([]);
    setAccentColors([]);
    setWoodTones([]);
    setTextures([]);
    setBudget('');
    setMustKeep([]);
    setHardNos([]);
    setConsiderations([]);
    setKeepInput('');
    setAvoidInput('');
    setCurrentStage(1);
    setMaxReachedStage(1);
    setCompletedStages([]);
    setShowSummary(false);
    setGeneratedStylePack(null);
    // Don't reset setStylePack(null) - keep the right sidebar summary intact
    window.scrollTo(0, 0);
  };

  const handleRefine = (refinement: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const stylePack = generateStylePackFromInputs(
        selectedGoal || 'calm',
        selectedChallenge || 'clutter',
        selectedImages
      );
      setStylePack(stylePack);
      setIsGenerating(false);
    }, 800);
  };

  const handleContinue = () => {
    setStep('budget');
    router.push('/budget');
  };

  const canGenerate = mode === 'known' 
    ? primaryStyle !== null
    : (selectedGoal && selectedChallenge && selectedImages.length === 3);

  // Calculate progress based on current stage and completed stages
  // Progress shows based on the furthest completed stage
  const progressPercentage = useMemo(() => {
    // If we have completed stages, use the max completed stage
    if (completedStages.length > 0) {
      const maxCompleted = Math.max(...completedStages);
      return (maxCompleted / 6) * 100;
    }
    // When starting at stage 1, show 0% progress
    return 0;
  }, [completedStages]);

  return (
    <div className={styles.stylePage}>
      <PageHero
        imageSrc="/images/hero-modern-room.jpg"
        imageAlt="Style hero image"
        title="Choose the style for this room"
        titleHighlight="style"
        description="Already have a style in mind, or want us to help you find it? Everything feeds the same Style DNA so our AI can be creative yet accurate."
      />

      <div className={styles.main}>
        {/* Visual Progress Bar Header */}
        <header className={styles.progressHeader}>
          <div className={styles.progressSteps}>
            {/* Background track */}
            <div className={styles.progressTrack}>
              <div className={styles.progressTrackFill} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            {[1, 2, 3, 4, 5, 6].map((step) => {
              const isActive = currentStage === step;
              const isCompleted = completedStages.includes(step);
              const isDisabled = !canAccessStage(step);
              
              return (
                <div
                  key={step}
                  className={`${styles.progressStep} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${isDisabled ? styles.disabled : ''}`}
                  onClick={() => handleProgressClick(step)}
                >
                  <div className={styles.progressStepCircle}>{step}</div>
                  <span className={styles.progressStepLabel}>
                    {step === 1 ? 'Room Setup' :
                     step === 2 ? 'Design' :
                     step === 3 ? 'Atmosphere' :
                     step === 4 ? 'Colors' :
                     step === 5 ? 'Preferences' : 'Review'}
                  </span>
                </div>
              );
            })}
          </div>
        </header>

        <main className={styles.mainContent}>
          {!showOutput && !isGenerating && (
            <>
              {/* Stage 1: Room Setup */}
              <section className={`${styles.stage} ${currentStage === 1 ? styles.active : ''}`} data-stage="1">
                <div className={styles.stageHeader}>
                  <h1 className={styles.stageTitle}>Room Setup</h1>
                  <p className={styles.stageDescription}>Let&apos;s start by understanding the space you want to transform. This helps us tailor recommendations to your specific needs.</p>
                </div>

                {/* Which room are you designing? */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Which room are you designing?</h3>
                      <p className={styles.sectionSubtitle}>Select the type of space</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.required}`}>Required</span>
                  </div>
                  <div className={`${styles.selectionGrid} ${styles.cols4}`}>
                    {[
                      { 
                        name: 'Living Room', 
                        desc: 'Main gathering space', 
                        paths: [
                          'M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9',
                          'M9 22V12h6v10',
                          'M2 10.6L12 2l10 8.6'
                        ]
                      },
                      { 
                        name: 'Bedroom', 
                        desc: 'Personal retreat', 
                        paths: [
                          'M2 4v16',
                          'M22 4v16',
                          'M2 8h20',
                          'M2 16h20'
                        ]
                      },
                      { 
                        name: 'Kitchen', 
                        desc: 'Culinary hub', 
                        paths: [
                          'M6 2v6',
                          'M10 2v6',
                          'M14 2v6',
                          'M18 2v6',
                          'M2 8h20v14H2z'
                        ]
                      },
                      { 
                        name: 'Dining Room', 
                        desc: 'Meal & entertainment', 
                        paths: [
                          'M3 11h18v10H3z',
                          'M12 3v8',
                          'M8 7h8'
                        ]
                      },
                      { 
                        name: 'Home Office', 
                        desc: 'Productive workspace', 
                        paths: [
                          'M2 3h20v14H2z',
                          'M8 21h8',
                          'M12 17v4'
                        ]
                      },
                      { 
                        name: 'Bathroom', 
                        desc: 'Spa & refresh', 
                        paths: [
                          'M4 12h16',
                          'M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6',
                          'M6 12V5a2 2 0 0 1 2-2h1'
                        ]
                      },
                      { 
                        name: 'Nursery', 
                        desc: 'Child&apos;s room', 
                        paths: [
                          'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
                          'M12 2v4',
                          'M12 18v4',
                          'M4.93 4.93l2.83 2.83',
                          'M16.24 16.24l2.83 2.83'
                        ]
                      },
                      { 
                        name: 'Outdoor', 
                        desc: 'Patio or garden', 
                        paths: [
                          'M12 2L2 7l10 5 10-5-10-5z',
                          'M2 17l10 5 10-5',
                          'M2 12l10 5 10-5'
                        ]
                      }
                    ].map((room) => (
                      <div
                        key={room.name}
                        className={`${styles.selectionCard} ${roomName === room.name ? styles.selected : ''}`}
                        onClick={() => handleRoomSelect(room.name)}
                      >
                        <div className={styles.selectionCardIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {room.paths.map((path, idx) => (
                              <path key={idx} d={path}></path>
                            ))}
                          </svg>
                        </div>
                        <div className={styles.selectionCardTitle}>{room.name}</div>
                        <div className={styles.selectionCardDesc}>{room.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Dimensions */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Room Dimensions</h3>
                      <p className={styles.sectionSubtitle}>Help us understand the scale of your space</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={`${styles.selectionGrid} ${styles.cols3}`}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Room Size</label>
                      <select 
                        className={styles.input} 
                        value={roomSize}
                        onChange={(e) => setRoomSize(e.target.value)}
                      >
                        <option value="">Select size...</option>
                        <option value="small">Small (under 150 sq ft)</option>
                        <option value="medium">Medium (150-300 sq ft)</option>
                        <option value="large">Large (300-500 sq ft)</option>
                        <option value="xlarge">Extra Large (500+ sq ft)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Ceiling Height</label>
                      <select 
                        className={styles.input}
                        value={ceilingHeight}
                        onChange={(e) => setCeilingHeight(e.target.value)}
                      >
                        <option value="">Select height...</option>
                        <option value="standard">Standard (8-9 ft)</option>
                        <option value="high">High (10-12 ft)</option>
                        <option value="vaulted">Vaulted (12+ ft)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Natural Light</label>
                      <select 
                        className={styles.input}
                        value={naturalLight}
                        onChange={(e) => setNaturalLight(e.target.value)}
                      >
                        <option value="">Select level...</option>
                        <option value="low">Low (few windows)</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (lots of windows)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary Purpose */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Primary Purpose</h3>
                      <p className={styles.sectionSubtitle}>How will this room primarily be used?</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.required}`}>Required</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {['Entertainment', 'Relaxation', 'Socializing', 'Working', 'Reading', 'Gaming', 'Meditation', 'Family Time'].map((purpose) => (
                      <button
                        key={purpose}
                        className={`${styles.chip} ${primaryPurpose.includes(purpose) ? styles.selected : ''}`}
                        onClick={() => handlePurposeToggle(purpose)}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Who uses this room? */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Who uses this room?</h3>
                      <p className={styles.sectionSubtitle}>Select all that apply</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {['Adults', 'Teenagers', 'Children', 'Elderly', 'Pets', 'Guests'].map((user) => (
                      <button
                        key={user}
                        className={`${styles.chip} ${roomUsers.includes(user) ? styles.selected : ''}`}
                        onClick={() => handleUserToggle(user)}
                      >
                        {user}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Stage 2: Design Direction */}
              <section className={`${styles.stage} ${currentStage === 2 ? styles.active : ''}`} data-stage="2">
                <div className={styles.stageHeader}>
                  <h1 className={styles.stageTitle}>Design Direction</h1>
                  <p className={styles.stageDescription}>Choose the aesthetic foundation for your space. Select a primary style and optional accent styles.</p>
                </div>

                {/* Primary Style Section */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Primary Style</h3>
                      <p className={styles.sectionSubtitle}>This will be the dominant aesthetic for your room</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.required}`}>Required</span>
                  </div>
                  <div className={`${styles.selectionGrid} ${styles.cols3}`}>
                    {['Modern', 'Scandinavian', 'Industrial', 'Mid-Century Modern', 'Bohemian', 'Minimalist', 'Traditional', 'Coastal', 'Japanese'].map((style) => (
                      <div
                        key={style}
                        className={`${styles.selectionCard} ${styles.selectionCardLg} ${primaryStyle === style ? styles.selected : ''}`}
                        onClick={() => handlePrimaryStyleSelect(style)}
                      >
                        <div className={styles.cardImage} style={{
                          background: style === 'Modern' ? 'linear-gradient(135deg, #f5f5f5, #e0e0e0)' :
                            style === 'Scandinavian' ? 'linear-gradient(135deg, #fafafa, #f0ebe3)' :
                            style === 'Industrial' ? 'linear-gradient(135deg, #4a4a4a, #2d2d2d)' :
                            style === 'Mid-Century Modern' ? 'linear-gradient(135deg, #d4a574, #c49a6c)' :
                            style === 'Bohemian' ? 'linear-gradient(135deg, #d4a373, #bc6c25)' :
                            style === 'Minimalist' ? 'linear-gradient(135deg, #ffffff, #f8f8f8)' :
                            style === 'Traditional' ? 'linear-gradient(135deg, #8b4513, #654321)' :
                            style === 'Coastal' ? 'linear-gradient(135deg, #87ceeb, #b0e0e6)' :
                            'linear-gradient(135deg, #d4c5a9, #c9b896)'
                        }}></div>
                        <div className={styles.cardBody}>
                          <div className={styles.selectionCardTitle}>{style}</div>
                          <div className={styles.selectionCardDesc}>
                            {style === 'Modern' ? 'Clean lines, minimal ornamentation' :
                              style === 'Scandinavian' ? 'Light, airy, functional' :
                              style === 'Industrial' ? 'Raw materials, urban edge' :
                              style === 'Mid-Century Modern' ? 'Retro elegance, organic curves' :
                              style === 'Bohemian' ? 'Eclectic, globally-inspired' :
                              style === 'Minimalist' ? 'Less is more, calm spaces' :
                              style === 'Traditional' ? 'Classic elegance, timeless' :
                              style === 'Coastal' ? 'Beach-inspired, breezy' :
                              'Zen simplicity, harmony'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Styles Section */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Accent Styles</h3>
                      <p className={styles.sectionSubtitle}>Add up to 2 complementary styles</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {['Modern', 'Scandinavian', 'Industrial', 'Bohemian', 'Rustic', 'Art Deco', 'Farmhouse', 'Mediterranean'].map((style) => (
                      <button
                        key={style}
                        className={`${styles.chip} ${styles.accent} ${accents.includes(style) ? styles.selected : ''}`}
                        onClick={() => handleAccentToggle(style)}
                        disabled={!accents.includes(style) && accents.length >= VALIDATION.MAX_ACCENT_STYLES}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Describe Your Vision Section */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Describe Your Vision</h3>
                      <p className={styles.sectionSubtitle}>Tell us in your own words</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="e.g., I want a loft-like space that feels warm and inviting..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </section>

              {/* Stage 3: Atmosphere & Feel */}
              <section className={`${styles.stage} ${currentStage === 3 ? styles.active : ''}`} data-stage="3">
                <div className={styles.stageHeader}>
                  <h1 className={styles.stageTitle}>Atmosphere & Feel</h1>
                  <p className={styles.stageDescription}>Click on the colored bars to set your preferences from 1-10. Each color represents a point on the spectrum.</p>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Style DNA</h3>
                      <p className={styles.sectionSubtitle}>Click the bars to select your preference level (1-10)</p>
                    </div>
                  </div>
                  <div className={styles.visualSliderGroup}>
                    {/* Era & Time Period */}
                    <div className={`${styles.visualSlider} ${styles.sliderEra}`} data-slider="era">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Era & Time Period</span>
                        <span className={styles.visualSliderValue}>{sliderValues.era || '—'}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Classic / Timeless</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Modern / Current</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.era === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, era: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.era === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Visual Density */}
                    <div className={`${styles.visualSlider} ${styles.sliderDensity}`} data-slider="density">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Visual Density</span>
                        <span className={styles.visualSliderValue}>{sliderValues.density || '—'}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Minimal / Sparse</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Layered / Rich</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.density === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, density: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.density === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Color Intensity */}
                    <div className={`${styles.visualSlider} ${styles.sliderColor}`} data-slider="colorIntensity">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Color Intensity</span>
                        <span className={styles.visualSliderValue}>{sliderValues.colorIntensity || '—'}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Neutral / Muted</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Colorful / Bold</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.colorIntensity === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, colorIntensity: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.colorIntensity === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className={`${styles.visualSlider} ${styles.sliderTemp}`} data-slider="temperature">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Temperature</span>
                        <span className={styles.visualSliderValue}>{sliderValues.temperature}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Cool / Crisp</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Warm / Cozy</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.temperature === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, temperature: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.temperature === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Material Feel */}
                    <div className={`${styles.visualSlider} ${styles.sliderMaterial}`} data-slider="material">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Material Feel</span>
                        <span className={styles.visualSliderValue}>{sliderValues.material || '—'}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Sleek / Polished</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Natural / Organic</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.material === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, material: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.material === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Energy Level */}
                    <div className={`${styles.visualSlider} ${styles.sliderEnergy}`} data-slider="energy">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Energy Level</span>
                        <span className={styles.visualSliderValue}>{sliderValues.energy}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Calm / Serene</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Energetic / Vibrant</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.energy === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, energy: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.energy === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Formality */}
                    <div className={`${styles.visualSlider} ${styles.sliderFormality}`} data-slider="formality">
                      <div className={styles.visualSliderHeader}>
                        <span className={styles.visualSliderTitle}>Formality</span>
                        <span className={styles.visualSliderValue}>{sliderValues.formality || '—'}</span>
                      </div>
                      <div className={styles.visualSliderLabels}>
                        <span className={`${styles.visualSliderLabel} ${styles.left}`}>Casual / Relaxed</span>
                        <span className={`${styles.visualSliderLabel} ${styles.right}`}>Formal / Refined</span>
                      </div>
                      <div className={styles.visualSliderTrack}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <div
                            key={val}
                            className={`${styles.visualSliderSegment} ${sliderValues.formality === val ? styles.active : ''}`}
                            onClick={() => setSliderValues({ ...sliderValues, formality: val })}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                      <div className={styles.visualSliderNumbers}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <span key={val} className={`${styles.visualSliderNumber} ${sliderValues.formality === val ? styles.active : ''}`}>
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Mood Keywords</h3>
                      <p className={styles.sectionSubtitle}>Select words that describe how you want your space to feel</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {['Tranquil', 'Sophisticated', 'Playful', 'Luxurious', 'Cozy', 'Airy', 'Dramatic', 'Organic', 'Romantic', 'Edgy', 'Nostalgic', 'Fresh'].map((mood) => (
                      <button
                        key={mood}
                        className={`${styles.chip} ${moodKeywords.includes(mood) ? styles.selected : ''}`}
                        onClick={() => {
                          setMoodKeywords(prev => 
                            prev.includes(mood)
                              ? prev.filter(m => m !== mood)
                              : [...prev, mood]
                          );
                        }}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Stage 4: Colors & Materials */}
              <section className={`${styles.stage} ${currentStage === 4 ? styles.active : ''}`} data-stage="4">
                <div className={styles.stageHeader}>
                  <h1 className={styles.stageTitle}>Colors & Materials</h1>
                  <p className={styles.stageDescription}>Define your color palette and material preferences.</p>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Base Color Palette</h3>
                      <p className={styles.sectionSubtitle}>Select 2-4 colors for your foundation</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.required}`}>Required</span>
                  </div>
                  <div className={styles.colorPalette}>
                    {['#FFFFFF', '#F5F5F0', '#E8E4DE', '#D4C5B9', '#B5A999', '#8B8178', '#5C5552', '#2D2926', '#1A1918', '#F0EBE3', '#E6D5C3', '#C4A484'].map((color) => (
                      <div
                        key={color}
                        className={`${styles.colorSwatch} ${['#FFFFFF', '#F5F5F0', '#E8E4DE', '#F0EBE3'].includes(color) ? styles.light : ''} ${baseColors.includes(color) ? styles.selected : ''}`}
                        style={{ background: color }}
                        onClick={() => {
                          if (baseColors.includes(color)) {
                            if (baseColors.length > VALIDATION.MIN_BASE_COLORS) {
                              setBaseColors(baseColors.filter(c => c !== color));
                            }
                          } else {
                            if (baseColors.length < VALIDATION.MAX_BASE_COLORS) {
                              setBaseColors([...baseColors, color]);
                            }
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Accent Colors</h3>
                      <p className={styles.sectionSubtitle}>Select 1-2 colors for pops of interest</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={styles.colorPalette}>
                    {['#D4A373', '#E07A5F', '#BC6C25', '#606C38', '#344E41', '#3D405B', '#5F7470', '#87CEEB', '#DDA0DD', '#F4D35E', '#CB997E', '#A98467'].map((color) => (
                      <div
                        key={color}
                        className={`${styles.colorSwatch} ${accentColors.includes(color) ? styles.selected : ''}`}
                        style={{ background: color }}
                        onClick={() => {
                          if (accentColors.includes(color)) {
                            setAccentColors(accentColors.filter(c => c !== color));
                          } else {
                            if (accentColors.length < 2) {
                              setAccentColors([...accentColors, color]);
                            }
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Wood Tones</h3>
                      <p className={styles.sectionSubtitle}>Choose your preferred wood finishes</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.required}`}>Required</span>
                  </div>
                  <div className={styles.materialGrid}>
                    {[
                      { name: 'Light Oak', gradient: 'linear-gradient(135deg, #F5DEB3, #DEB887)' },
                      { name: 'Natural Ash', gradient: 'linear-gradient(135deg, #D2B48C, #C4A86C)' },
                      { name: 'Medium Walnut', gradient: 'linear-gradient(135deg, #8B7355, #6B4423)' },
                      { name: 'Dark Espresso', gradient: 'linear-gradient(135deg, #4A3728, #2D1F14)' },
                      { name: 'Honey Pine', gradient: 'linear-gradient(135deg, #CD853F, #A0522D)' },
                      { name: 'Teak', gradient: 'linear-gradient(135deg, #B8860B, #8B6914)' },
                      { name: 'Rich Mahogany', gradient: 'linear-gradient(135deg, #8B4513, #5D2E0C)' },
                      { name: 'Gray Wash', gradient: 'linear-gradient(135deg, #A9A9A9, #808080)' }
                    ].map((wood) => (
                      <div
                        key={wood.name}
                        className={`${styles.materialCard} ${woodTones.includes(wood.name) ? styles.selected : ''}`}
                        onClick={() => {
                          if (woodTones.includes(wood.name)) {
                            if (woodTones.length > VALIDATION.MIN_WOOD_TONES) {
                              setWoodTones(woodTones.filter(w => w !== wood.name));
                            }
                          } else {
                            setWoodTones([...woodTones, wood.name]);
                          }
                        }}
                      >
                        <div className={styles.materialTexture} style={{ background: wood.gradient }}></div>
                        <div className={styles.materialLabel}>{wood.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Fabric & Texture Preferences</h3>
                      <p className={styles.sectionSubtitle}>What textures appeal to you?</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {['Velvet', 'Linen', 'Leather', 'Boucle', 'Cotton', 'Wool', 'Jute / Sisal', 'Rattan', 'Marble', 'Terrazzo'].map((texture) => (
                      <button
                        key={texture}
                        className={`${styles.chip} ${textures.includes(texture) ? styles.selected : ''}`}
                        onClick={() => {
                          setTextures(prev => 
                            prev.includes(texture)
                              ? prev.filter(t => t !== texture)
                              : [...prev, texture]
                          );
                        }}
                      >
                        {texture}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Stage 5: Preferences & Limits */}
              <section className={`${styles.stage} ${currentStage === 5 ? styles.active : ''}`} data-stage="5">
                <div className={styles.stageHeader}>
                  <h1 className={styles.stageTitle}>Preferences & Limits</h1>
                  <p className={styles.stageDescription}>Set your budget and tell us what to keep or avoid.</p>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Budget Range</h3>
                      <p className={styles.sectionSubtitle}>What&apos;s your investment level?</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.required}`}>Required</span>
                  </div>
                  <div className={styles.budgetOptions}>
                    {[
                      { id: 'budget', title: 'Budget-Friendly', range: 'Under $2,500', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
                      { id: 'moderate', title: 'Moderate', range: '$2,500 - $7,500', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
                      { id: 'premium', title: 'Premium', range: '$7,500 - $15,000', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
                      { id: 'luxury', title: 'Luxury', range: '$15,000+', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }
                    ].map((budgetOption) => (
                      <div
                        key={budgetOption.id}
                        className={`${styles.budgetCard} ${budget === budgetOption.id ? styles.selected : ''}`}
                        onClick={() => setBudget(budgetOption.id)}
                      >
                        <div className={styles.budgetIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d={budgetOption.icon}></path>
                          </svg>
                        </div>
                        <div className={styles.budgetTitle}>{budgetOption.title}</div>
                        <div className={styles.budgetRange}>{budgetOption.range}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${styles.guardrailCard} ${styles.keep}`}>
                  <div className={styles.guardrailHeader}>
                    <div className={styles.guardrailIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.guardrailTitle}>Must Keep Items</h3>
                      <p className={styles.guardrailSubtitle}>Existing pieces to design around</p>
                    </div>
                  </div>
                  <div className={styles.guardrailInputRow}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g., blue velvet sofa..."
                      value={keepInput}
                      onChange={(e) => setKeepInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && keepInput.trim()) {
                          setMustKeep([...mustKeep, keepInput.trim()]);
                          setKeepInput('');
                        }
                      }}
                    />
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => {
                        if (keepInput.trim()) {
                          setMustKeep([...mustKeep, keepInput.trim()]);
                          setKeepInput('');
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div className={styles.guardrailTags}>
                    {mustKeep.map((item, idx) => (
                      <span key={idx} className={styles.guardrailTag}>
                        {item}
                        <button onClick={() => setMustKeep(mustKeep.filter((_, i) => i !== idx))}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`${styles.guardrailCard} ${styles.avoid}`}>
                  <div className={styles.guardrailHeader}>
                    <div className={styles.guardrailIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.guardrailTitle}>Hard No&apos;s</h3>
                      <p className={styles.guardrailSubtitle}>Things to completely avoid</p>
                    </div>
                  </div>
                  <div className={styles.guardrailInputRow}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g., no leather..."
                      value={avoidInput}
                      onChange={(e) => setAvoidInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && avoidInput.trim()) {
                          setHardNos([...hardNos, avoidInput.trim()]);
                          setAvoidInput('');
                        }
                      }}
                    />
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => {
                        if (avoidInput.trim()) {
                          setHardNos([...hardNos, avoidInput.trim()]);
                          setAvoidInput('');
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div className={styles.guardrailTags}>
                    {hardNos.map((item, idx) => (
                      <span key={idx} className={styles.guardrailTag}>
                        {item}
                        <button onClick={() => setHardNos(hardNos.filter((_, i) => i !== idx))}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>Special Considerations</h3>
                      <p className={styles.sectionSubtitle}>Select any that apply</p>
                    </div>
                    <span className={`${styles.sectionBadge} ${styles.optional}`}>Optional</span>
                  </div>
                  <div className={styles.chipGroup}>
                    {['Pet-Friendly', 'Child-Safe', 'Eco-Friendly', 'Easy to Clean', 'Hypoallergenic'].map((consideration) => (
                      <button
                        key={consideration}
                        className={`${styles.chip} ${considerations.includes(consideration) ? styles.selected : ''}`}
                        onClick={() => {
                          setConsiderations(prev => 
                            prev.includes(consideration)
                              ? prev.filter(c => c !== consideration)
                              : [...prev, consideration]
                          );
                        }}
                      >
                        {consideration}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Stage 6: Review & Confirm */}
              <section className={`${styles.stage} ${currentStage === 6 && !showSummary && !isGenerating ? styles.active : ''}`} data-stage="6">
                <div className={styles.stageHeader}>
                  <h1 className={styles.stageTitle}>Review & Confirm</h1>
                  <p className={styles.stageDescription}>Review your selections before generating recommendations.</p>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewHeaderTitle}>
                      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      </svg>
                      Room Setup
                    </span>
                    <button className={styles.reviewEditBtn} onClick={() => goToStage(1)}>Edit</button>
                  </div>
                  <div className={styles.reviewBody}>
                    <div className={styles.reviewGrid}>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewItemLabel}>Room Type</div>
                        <div className={styles.reviewItemValue}>{roomName}</div>
                      </div>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewItemLabel}>Primary Purpose</div>
                        <div className={styles.reviewItemValue}>{primaryPurpose.join(', ') || 'None'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewHeaderTitle}>
                      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Design Direction
                    </span>
                    <button className={styles.reviewEditBtn} onClick={() => goToStage(2)}>Edit</button>
                  </div>
                  <div className={styles.reviewBody}>
                    <div className={styles.reviewGrid}>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewItemLabel}>Primary Style</div>
                        <div className={styles.reviewItemValue}>{primaryStyle || 'Not selected'}</div>
                      </div>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewItemLabel}>Accent Styles</div>
                        <div className={styles.reviewTags}>
                          {accents.length > 0 ? accents.map((accent, idx) => (
                            <span key={idx} className={styles.reviewTag}>{accent}</span>
                          )) : <span className={styles.reviewItemValue}>None</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewHeaderTitle}>
                      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Atmosphere & Feel
                    </span>
                    <button className={styles.reviewEditBtn} onClick={() => goToStage(3)}>Edit</button>
                  </div>
                  <div className={styles.reviewBody}>
                    <div className={styles.reviewGrid}>
                      <div className={styles.reviewItem}>
                        <div className={styles.reviewItemLabel}>Style DNA</div>
                        <div className={styles.reviewItemValue}>
                          {sliderValues.era > 0 && sliderValues.density > 0 && sliderValues.colorIntensity > 0
                            ? `Era: ${sliderValues.era}, Density: ${sliderValues.density}, Color: ${sliderValues.colorIntensity}`
                            : 'Not set'}
                        </div>
                      </div>
                      {moodKeywords.length > 0 && (
                        <div className={styles.reviewItem}>
                          <div className={styles.reviewItemLabel}>Mood Keywords</div>
                          <div className={styles.reviewTags}>
                            {moodKeywords.map((mood, idx) => (
                              <span key={idx} className={styles.reviewTag}>{mood}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewHeaderTitle}>
                      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.434-.652-.434-1.125 0-.926.746-1.648 1.648-1.648 1.7 0 3.002-1.3 3.002-3.002 0-1.701-1.3-3.002-3.002-3.002z"></path>
                      </svg>
                      Colors & Materials
                    </span>
                    <button className={styles.reviewEditBtn} onClick={() => goToStage(4)}>Edit</button>
                  </div>
                  <div className={styles.reviewBody}>
                    <div className={styles.reviewGrid}>
                      {baseColors.length > 0 && (
                        <div className={styles.reviewItem}>
                          <div className={styles.reviewItemLabel}>Base Colors</div>
                          <div className={styles.reviewColors}>
                            {baseColors.map((color, idx) => (
                              <div key={idx} className={styles.reviewColor} style={{ backgroundColor: color }} />
                            ))}
                          </div>
                        </div>
                      )}
                      {woodTones.length > 0 && (
                        <div className={styles.reviewItem}>
                          <div className={styles.reviewItemLabel}>Wood Tones</div>
                          <div className={styles.reviewTags}>
                            {woodTones.map((wood, idx) => (
                              <span key={idx} className={styles.reviewTag}>{wood}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewHeaderTitle}>
                      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Budget
                    </span>
                    <button className={styles.reviewEditBtn} onClick={() => goToStage(5)}>Edit</button>
                  </div>
                  <div className={styles.reviewBody}>
                    <div className={styles.reviewItem}>
                      <div className={styles.reviewItemLabel}>Budget Range</div>
                      <div className={styles.reviewItemValue}>
                        {budget === 'budget' ? 'Budget-Friendly (Under $2,500)' :
                         budget === 'moderate' ? 'Moderate ($2,500 - $7,500)' :
                         budget === 'premium' ? 'Premium ($7,500 - $15,000)' :
                         budget === 'luxury' ? 'Luxury ($15,000+)' :
                         'Not set'}
                      </div>
                    </div>
                  </div>
                </div>

              </section>
            </>
          )}

          {/* Loading Animation - Show when generating in Stage 6 */}
          {isGenerating && currentStage === 6 && (
            <div className={styles.stage} style={{ display: 'block' }}>
              <LoadingMoment
                stages={[
                  'Analyzing your choices...',
                  'Mapping taste patterns...',
                  'Generating your Style Pack...'
                ]}
                duration={2000}
              />
            </div>
          )}

          {showSummary && generatedStylePack && !isGenerating && currentStage === 6 && (
            <div className={styles.stage} style={{ display: 'block' }}>
              <div className={styles.summaryContainer}>
                <div className={styles.summaryHeader}>
                  <h2 className={styles.summaryTitle}>Your Style Summary</h2>
                  <p className={styles.summarySubtitle}>Review your generated style profile</p>
                </div>
                
                <div className={styles.summaryCard}>
                  <div className={styles.summarySection}>
                    <div className={styles.summaryLabel}>Direction</div>
                    <div className={styles.summaryValue}>{generatedStylePack.direction}</div>
                  </div>
                  
                  {generatedStylePack.palette.length > 0 && (
                    <div className={styles.summarySection}>
                      <div className={styles.summaryLabel}>Color Palette</div>
                      <div className={styles.summaryPalette}>
                        {generatedStylePack.palette.map((color: string, idx: number) => (
                          <div
                            key={idx}
                            className={styles.summaryColorSwatch}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedStylePack.materials.length > 0 && (
                    <div className={styles.summarySection}>
                      <div className={styles.summaryLabel}>Materials</div>
                      <div className={styles.summaryTags}>
                        {generatedStylePack.materials.map((material: string, idx: number) => (
                          <span key={idx} className={styles.summaryTag}>{material}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedStylePack.keepRules.length > 0 && (
                    <div className={styles.summarySection}>
                      <div className={styles.summaryLabel}>Must Keep</div>
                      <div className={styles.summaryTags}>
                        {generatedStylePack.keepRules.map((rule: string, idx: number) => (
                          <span key={idx} className={styles.summaryTag}>{rule}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedStylePack.avoidRules.length > 0 && (
                    <div className={styles.summarySection}>
                      <div className={styles.summaryLabel}>Avoid</div>
                      <div className={styles.summaryTags}>
                        {generatedStylePack.avoidRules.map((rule: string, idx: number) => (
                          <span key={idx} className={styles.summaryTag}>{rule}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.summaryActions}>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={handleUpdateSummary}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Update to Summary Tab
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={handleStartOver}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M3 21v-5h5"></path>
                      </svg>
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showOutput && state.stylePack && !isGenerating && currentStage !== 6 && (
            <div className={styles.stage} style={{ display: 'block' }}>
              <StylePackOutput
                stylePack={state.stylePack}
                onRefine={handleRefine}
              />
              <div className={styles.continueButtonContainer}>
                <button
                  className={styles.continueButton}
                  onClick={handleContinue}
                >
                  Continue to Budget →
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons - At bottom of main content */}
          {!showOutput && !isGenerating && !showSummary && currentStage === 6 && (
            <div className={styles.navigationButtons}>
              <button 
                className={`${styles.btn} ${styles.btnGhost}`} 
                onClick={prevStage}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back
              </button>
              <div></div>
              <button 
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                onClick={nextStage}
                disabled={false}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Generate Recommendations
              </button>
            </div>
          )}

          {/* Navigation Buttons for other stages */}
          {!showOutput && !isGenerating && !showSummary && currentStage !== 6 && (
            <div className={styles.navigationButtons}>
              <button 
                className={`${styles.btn} ${styles.btnGhost}`} 
                onClick={prevStage} 
                style={{ display: currentStage > 1 ? 'inline-flex' : 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back
              </button>
              <div></div>
              <button 
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} 
                onClick={nextStage}
              disabled={
                (currentStage === 1 && (!roomName || primaryPurpose.length === 0)) ||
                (currentStage === 2 && !primaryStyle) ||
                (currentStage === 4 && (baseColors.length < VALIDATION.MIN_BASE_COLORS || woodTones.length < VALIDATION.MIN_WOOD_TONES)) ||
                (currentStage === 5 && !budget)
              }
              >
                {currentStage === 6 ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Generate Recommendations
                  </>
                ) : (
                  <>
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

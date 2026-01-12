'use client';

import React, { useState } from 'react';
import styles from './TutorialModal.module.css';


interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    step: 1,
    title: "Welcome to Furniture Designer!",
    description: "Let's take a quick tour of how to use this 3D furniture visualizer. You can interact with the app while following along!"
  },
  {
    step: 2,
    title: "Select Furniture",
    description: "Choose from different furniture types in the left panel. Click on any furniture to add it to your room."
  },
  {
    step: 3,
    title: "3D Visualization",
    description: "Your furniture appears in this 3D room. You can rotate the view by dragging, zoom with mouse wheel, and pan by right-clicking and dragging."
  },
  {
    step: 4,
    title: "Customize Furniture",
    description: "Click on any furniture piece to select it, then use the right panel to change colors, materials, and specific parts."
  },
  {
    step: 5,
    title: "Room Settings",
    description: "Adjust room dimensions and settings using the controls in the top-right corner."
  },
  {
    step: 6,
    title: "Share Your Design",
    description: "When you're happy with your design, use the save or reset buttons in the header!"
  }
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(1);


  if (!isOpen) return null;

  const currentStepData = tutorialSteps[currentStep - 1];

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.stepIndicator}>
            Step {currentStep} of 6
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>{currentStepData.title}</h2>
          <p className={styles.modalDescription}>{currentStepData.description}</p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.navButton} ${styles.previousButton}`}
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </button>
          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
          >
            {currentStep === 6 ? 'Finish' : 'Next >'}
          </button>
        </div>
      </div>
    </div>
  );
}

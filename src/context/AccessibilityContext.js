import React, { createContext, useContext, useState, useEffect } from 'react';
import { announceToScreenReader } from '../utils/accessibility';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderAnnouncements: true
  });

  const [announcements, setAnnouncements] = useState([]);

  // Check for user preferences
  useEffect(() => {
    const checkUserPreferences = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      setPreferences(prev => ({
        ...prev,
        reducedMotion,
        highContrast
      }));
    };

    checkUserPreferences();

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Announce to screen reader
  const announce = (message, priority = 'polite') => {
    if (preferences.screenReaderAnnouncements) {
      announceToScreenReader(message, priority);
    }
    
    // Store announcement for debugging
    setAnnouncements(prev => [...prev, { message, priority, timestamp: Date.now() }]);
  };

  // Update preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // Toggle specific preference
  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Get CSS classes based on preferences
  const getAccessibilityClasses = () => {
    const classes = [];
    
    if (preferences.reducedMotion) {
      classes.push('reduced-motion');
    }
    
    if (preferences.highContrast) {
      classes.push('high-contrast');
    }
    
    if (preferences.largeText) {
      classes.push('large-text');
    }
    
    return classes.join(' ');
  };

  const value = {
    preferences,
    announcements,
    announce,
    updatePreferences,
    togglePreference,
    getAccessibilityClasses
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div className={`accessibility-wrapper ${getAccessibilityClasses()}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}; 
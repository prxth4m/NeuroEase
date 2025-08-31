"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: 'default' | 'dyslexic' | 'mono';
  contrast: 'normal' | 'high' | 'inverted';
  focusMode: 'none' | 'line' | 'paragraph' | 'sentence';
  backgroundTint: 'none' | 'blue' | 'yellow' | 'green';
  wordSpacing: number;
  enableBionic: boolean;
  enableFocusWindow: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  lineHeight: 1.6,
  letterSpacing: 0,
  fontFamily: 'default',
  contrast: 'normal',
  focusMode: 'none',
  backgroundTint: 'none',
  wordSpacing: 0,
  enableBionic: false,
  enableFocusWindow: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('adaptive-reading-settings');
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('adaptive-reading-settings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('adaptive-reading-settings');
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
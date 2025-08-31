"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityContext';

interface UserBehavior {
  idleTime: number;
  scrollSpeed: number;
  readingPace: number;
  focusLevel: 'low' | 'medium' | 'high';
  needsAssistance: boolean;
}

interface UserBehaviorContextType {
  behavior: UserBehavior;
  isTracking: boolean;
  toggleTracking: () => void;
}

const UserBehaviorContext = createContext<UserBehaviorContextType | undefined>(undefined);

export function UserBehaviorProvider({ children }: { children: React.ReactNode }) {
  const { updateSettings, settings } = useAccessibility();
  const [behavior, setBehavior] = useState<UserBehavior>({
    idleTime: 0,
    scrollSpeed: 0,
    readingPace: 0,
    focusLevel: 'medium',
    needsAssistance: false,
  });
  const [isTracking, setIsTracking] = useState(true);
  
  const lastScrollTime = useRef(Date.now());
  const lastScrollY = useRef(0);
  const idleTimer = useRef<NodeJS.Timeout>();
  const scrollSpeedBuffer = useRef<number[]>([]);

  useEffect(() => {
    if (!isTracking) return;

    const handleScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      const timeDiff = now - lastScrollTime.current;
      const distanceDiff = Math.abs(currentY - lastScrollY.current);
      
      if (timeDiff > 0) {
        const speed = distanceDiff / timeDiff;
        
        // Keep buffer of last 10 scroll events
        scrollSpeedBuffer.current.push(speed);
        if (scrollSpeedBuffer.current.length > 10) {
          scrollSpeedBuffer.current.shift();
        }
        
        const avgSpeed = scrollSpeedBuffer.current.reduce((a, b) => a + b, 0) / scrollSpeedBuffer.current.length;
        
        setBehavior(prev => ({
          ...prev,
          scrollSpeed: avgSpeed,
          idleTime: 0
        }));
        
        // Adaptive responses to fast scrolling
        if (avgSpeed > 2) {
          updateSettings({
            focusMode: 'line',
            enableFocusWindow: true,
            fontSize: Math.min(20, settings.fontSize + 1)
          });
        }
      }
      
      lastScrollTime.current = now;
      lastScrollY.current = currentY;
      
      // Reset idle timer
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      
      idleTimer.current = setTimeout(() => {
        setBehavior(prev => ({
          ...prev,
          idleTime: prev.idleTime + 1000
        }));
      }, 1000);
    };

    const handleMouseMove = () => {
      setBehavior(prev => ({
        ...prev,
        idleTime: 0
      }));
    };

    const handleKeyPress = () => {
      setBehavior(prev => ({
        ...prev,
        idleTime: 0,
        focusLevel: 'high'
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('keypress', handleKeyPress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keypress', handleKeyPress);
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
    };
  }, [isTracking, updateSettings]);

  // Adaptive behavior based on idle time
  useEffect(() => {
    if (!isTracking) return;
    
    if (behavior.idleTime > 5000) { // 5 seconds idle
      setBehavior(prev => ({
        ...prev,
        needsAssistance: true,
        focusLevel: 'low'
      }));
      
      // Increase font size and enable focus aids
      updateSettings({
        fontSize: 18,
        contrast: 'high',
        focusMode: 'paragraph'
      });
    }
  }, [behavior.idleTime, isTracking, updateSettings]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <UserBehaviorContext.Provider value={{ behavior, isTracking, toggleTracking }}>
      {children}
    </UserBehaviorContext.Provider>
  );
}

export function useUserBehavior() {
  const context = useContext(UserBehaviorContext);
  if (context === undefined) {
    throw new Error('useUserBehavior must be used within a UserBehaviorProvider');
  }
  return context;
}
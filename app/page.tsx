"use client";

import { useState, useEffect } from 'react';
import ReadingInterface from '@/components/ReadingInterface';
import AccessibilityControls from '@/components/AccessibilityControls';
import { UserBehaviorProvider } from '@/contexts/UserBehaviorContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AccessibilityProvider>
      <UserBehaviorProvider>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <main className="relative">
            <AccessibilityControls />
            <ReadingInterface />
          </main>
        </div>
      </UserBehaviorProvider>
    </AccessibilityProvider>
  );
}
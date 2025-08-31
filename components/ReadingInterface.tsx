"use client";

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useUserBehavior } from '@/contexts/UserBehaviorContext';
import TextRenderer from './TextRenderer';
import FocusWindow from './FocusWindow';
import { sampleText } from '@/lib/sampleText';

export default function ReadingInterface() {
  const { settings } = useAccessibility();
  const { behavior } = useUserBehavior();
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const paragraphs = sampleText.split('\n\n').filter(p => p.trim());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        setCurrentParagraph(prev => Math.min(prev + 1, paragraphs.length - 1));
      } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        setCurrentParagraph(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paragraphs.length]);

  const getFontFamily = () => {
    switch (settings.fontFamily) {
      case 'dyslexic':
        return 'OpenDyslexic, monospace';
      case 'mono':
        return 'ui-monospace, monospace';
      default:
        return 'ui-sans-serif, system-ui, sans-serif';
    }
  };

  const getContrastStyles = () => {
    switch (settings.contrast) {
      case 'high':
        return 'bg-black text-white';
      case 'inverted':
        return 'bg-white text-black border border-gray-300';
      default:
        return 'bg-background text-foreground';
    }
  };

  const getBackgroundTint = () => {
    switch (settings.backgroundTint) {
      case 'blue':
        return 'bg-blue-50';
      case 'yellow':
        return 'bg-yellow-50';
      case 'green':
        return 'bg-green-50';
      default:
        return '';
    }
  };

  const containerStyles = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}px`,
    wordSpacing: `${settings.wordSpacing}px`,
    fontFamily: getFontFamily(),
  };

  return (
    <div className="relative min-h-screen">
      {/* OpenDyslexic Font Loading */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&display=swap" 
      />
      
      <div 
        ref={containerRef}
        className={`
          max-w-4xl mx-auto px-6 py-12 transition-all duration-500
          ${getContrastStyles()}
          ${getBackgroundTint()}
        `}
        style={containerStyles}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 transition-all duration-300">
            Adaptive Reading Experience
          </h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Focus Level: {behavior.focusLevel}</span>
            <span>Scroll Speed: {behavior.scrollSpeed.toFixed(2)}</span>
            <span>Idle: {behavior.idleTime}ms</span>
          </div>
        </div>

        <div className="space-y-8">
          {paragraphs.map((paragraph, index) => (
            <TextRenderer
              key={index}
              text={paragraph}
              isActive={index === currentParagraph}
              paragraphIndex={index}
              shouldHighlight={settings.focusMode !== 'none'}
              onLineChange={setCurrentLine}
            />
          ))}
        </div>

        {/* Navigation hints */}
        <div className="fixed bottom-6 right-6 text-sm text-muted-foreground">
          <p>Use Ctrl + ↑/↓ to navigate paragraphs</p>
        </div>
      </div>

      {settings.enableFocusWindow && (
        <FocusWindow 
          targetElement={containerRef.current}
          currentParagraph={currentParagraph}
          currentLine={currentLine}
        />
      )}
    </div>
  );
}
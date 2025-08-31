"use client";

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface FocusWindowProps {
  targetElement: HTMLElement | null;
  currentParagraph: number;
  currentLine: number;
}

export default function FocusWindow({ targetElement, currentParagraph, currentLine }: FocusWindowProps) {
  const { settings } = useAccessibility();
  const [windowPosition, setWindowPosition] = useState({ top: 0, height: 100 });

  useEffect(() => {
    if (!targetElement || !settings.enableFocusWindow) return;

    const updatePosition = () => {
      const paragraphs = targetElement.querySelectorAll('div[class*="space-y-8"] > div');
      const currentPara = paragraphs[currentParagraph] as HTMLElement;
      
      if (currentPara) {
        const rect = currentPara.getBoundingClientRect();
        const containerRect = targetElement.getBoundingClientRect();
        
        setWindowPosition({
          top: rect.top - containerRect.top + targetElement.scrollTop,
          height: rect.height + 32, // Add padding
        });
      }
    };

    updatePosition();
    
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(targetElement);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [targetElement, currentParagraph, currentLine, settings.enableFocusWindow]);

  if (!settings.enableFocusWindow) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Overlay that dims everything except the focus area */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Focus window */}
      <div
        className="absolute left-0 right-0 bg-white/5 border-2 border-blue-400 rounded-lg transition-all duration-500 ease-out shadow-2xl backdrop-blur-sm"
        style={{
          top: `${windowPosition.top}px`,
          height: `${windowPosition.height}px`,
          marginLeft: '5%',
          marginRight: '5%',
        }}
      >
        <div className="absolute -top-8 left-0 text-sm text-blue-400 font-medium bg-black/50 px-2 py-1 rounded">
          Focus Area
        </div>
      </div>
    </div>
  );
}
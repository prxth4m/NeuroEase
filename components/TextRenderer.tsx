"use client";

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useUserBehavior } from '@/contexts/UserBehaviorContext';

interface TextRendererProps {
  text: string;
  isActive: boolean;
  paragraphIndex: number;
  shouldHighlight: boolean;
  onLineChange: (lineIndex: number) => void;
}

export default function TextRenderer({ 
  text, 
  isActive, 
  paragraphIndex, 
  shouldHighlight, 
  onLineChange 
}: TextRendererProps) {
  const { settings } = useAccessibility();
  const { behavior } = useUserBehavior();
  const [highlightedLine, setHighlightedLine] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const paragraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Split text into sentences for better focus control
    const sentenceArray = text.split(/[.!?]+/).filter(s => s.trim());
    setSentences(sentenceArray);
  }, [text]);

  useEffect(() => {
    if (!isActive || !shouldHighlight) return;

    const interval = setInterval(() => {
      if (settings.focusMode === 'sentence') {
        setHighlightedLine(prev => (prev + 1) % sentences.length);
        onLineChange(highlightedLine);
      }
    }, 3000); // Auto-advance every 3 seconds

    return () => clearInterval(interval);
  }, [isActive, shouldHighlight, sentences.length, settings.focusMode, highlightedLine, onLineChange]);

  const renderBionicText = (text: string) => {
    return text.split(' ').map((word, index) => {
      if (word.length <= 1) return <span key={index}>{word} </span>;
      
      const midpoint = Math.ceil(word.length / 2);
      const bold = word.slice(0, midpoint);
      const normal = word.slice(midpoint);
      
      return (
        <span key={index}>
          <strong className="font-bold">{bold}</strong>
          <span className="font-normal">{normal}</span>
          {' '}
        </span>
      );
    });
  };

  const getHighlightClass = (index: number) => {
    if (!shouldHighlight || !isActive) return '';
    
    switch (settings.focusMode) {
      case 'line':
      case 'sentence':
        return index === highlightedLine 
          ? 'bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded transition-all duration-300' 
          : 'opacity-60';
      case 'paragraph':
        return 'bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-lg';
      default:
        return '';
    }
  };

  const getOpacity = () => {
    if (!isActive && shouldHighlight) return 'opacity-40';
    if (behavior.needsAssistance) return 'opacity-90';
    return 'opacity-100';
  };

  return (
    <div 
      ref={paragraphRef}
      className={`
        transition-all duration-500 ease-in-out
        ${getOpacity()}
        ${isActive && settings.focusMode === 'paragraph' ? getHighlightClass(0) : ''}
      `}
      onMouseEnter={() => onLineChange(paragraphIndex)}
    >
      {settings.focusMode === 'sentence' ? (
        <div className="space-y-2">
          {sentences.map((sentence, index) => (
            <div
              key={index}
              className={`
                transition-all duration-300 cursor-pointer
                ${getHighlightClass(index)}
              `}
              onClick={() => setHighlightedLine(index)}
            >
              {settings.enableBionic ? renderBionicText(sentence.trim()) : sentence.trim()}
            </div>
          ))}
        </div>
      ) : (
        <p className="leading-relaxed">
          {settings.enableBionic ? renderBionicText(text) : text}
        </p>
      )}
    </div>
  );
}
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Focus, 
  Eye, 
  Brain,
  Check
} from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface ReadingMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: Partial<any>;
  color: string;
}

const readingModes: ReadingMode[] = [
  {
    id: 'dyslexia',
    name: 'Dyslexia Support',
    description: 'OpenDyslexic font with enhanced letter spacing',
    icon: <Brain className="w-5 h-5" />,
    settings: {
      fontFamily: 'dyslexic',
      letterSpacing: 1,
      lineHeight: 1.8,
      fontSize: 18,
      backgroundTint: 'yellow'
    },
    color: 'bg-purple-100 border-purple-300'
  },
  {
    id: 'adhd',
    name: 'ADHD Focus',
    description: 'Line-by-line highlighting with focus window',
    icon: <Focus className="w-5 h-5" />,
    settings: {
      focusMode: 'line',
      enableFocusWindow: true,
      fontSize: 16,
      contrast: 'high'
    },
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'lowvision',
    name: 'Low Vision',
    description: 'High contrast with large text and spacing',
    icon: <Eye className="w-5 h-5" />,
    settings: {
      fontSize: 24,
      contrast: 'high',
      lineHeight: 2.0,
      letterSpacing: 2,
      wordSpacing: 4
    },
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'standard',
    name: 'Standard Reading',
    description: 'Clean, distraction-free reading experience',
    icon: <BookOpen className="w-5 h-5" />,
    settings: {
      fontFamily: 'default',
      fontSize: 16,
      lineHeight: 1.6,
      contrast: 'normal',
      focusMode: 'none'
    },
    color: 'bg-gray-100 border-gray-300'
  }
];

export default function ReadingModeSelector() {
  const { settings, updateSettings } = useAccessibility();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const applyMode = (mode: ReadingMode) => {
    updateSettings(mode.settings);
    setSelectedMode(mode.id);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-center">Choose Your Reading Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {readingModes.map((mode) => (
            <Button
              key={mode.id}
              variant="outline"
              className={`
                h-auto p-4 flex flex-col items-start gap-3 text-left
                hover:shadow-md transition-all duration-200
                ${selectedMode === mode.id ? mode.color : ''}
              `}
              onClick={() => applyMode(mode)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <span className="font-medium">{mode.name}</span>
                </div>
                {selectedMode === mode.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {mode.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
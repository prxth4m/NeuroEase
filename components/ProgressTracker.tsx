"use client";

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Target } from 'lucide-react';

interface ReadingProgress {
  wordsRead: number;
  timeSpent: number;
  currentPosition: number;
  estimatedTimeRemaining: number;
}

export default function ProgressTracker() {
  const [progress, setProgress] = useState<ReadingProgress>({
    wordsRead: 0,
    timeSpent: 0,
    currentPosition: 0,
    estimatedTimeRemaining: 0
  });

  const [startTime] = useState(Date.now());
  const totalWords = 850; // Approximate word count of sample text

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Date.now() - startTime;
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      const wordsRead = Math.round((scrollPercent / 100) * totalWords);
      
      const readingSpeed = wordsRead / (timeSpent / 60000); // words per minute
      const remainingWords = totalWords - wordsRead;
      const estimatedTimeRemaining = remainingWords / Math.max(readingSpeed, 1);

      setProgress({
        wordsRead,
        timeSpent,
        currentPosition: scrollPercent,
        estimatedTimeRemaining: estimatedTimeRemaining * 60000 // convert to ms
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="fixed bottom-4 right-4 p-3 w-64 bg-white/90 backdrop-blur-sm border shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Reading Progress</span>
        </div>
        
        <Progress value={progress.currentPosition} className="h-2" />
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span>{progress.wordsRead}/{totalWords} words</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>{formatTime(progress.timeSpent)}</span>
          </div>
        </div>
        
        {progress.estimatedTimeRemaining > 0 && (
          <Badge variant="outline" className="text-xs w-full justify-center">
            ~{formatTime(progress.estimatedTimeRemaining)} remaining
          </Badge>
        )}
      </div>
    </Card>
  );
}
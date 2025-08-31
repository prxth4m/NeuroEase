"use client";

import { useUserBehavior } from '@/contexts/UserBehaviorContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Eye, Timer, Zap } from 'lucide-react';

export default function BehaviorIndicator() {
  const { behavior, isTracking } = useUserBehavior();

  if (!isTracking) return null;

  const getActivityColor = () => {
    switch (behavior.focusLevel) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 p-3 w-64 bg-white/90 backdrop-blur-sm border shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4" />
        <span className="text-sm font-medium">Reading Analytics</span>
        <div className={`w-2 h-2 rounded-full ${getActivityColor()}`} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Timer className="w-3 h-3 text-muted-foreground" />
          <span>Idle: {Math.round(behavior.idleTime / 1000)}s</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-muted-foreground" />
          <span>Speed: {behavior.scrollSpeed.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs px-1 py-0">
            {behavior.focusLevel}
          </Badge>
        </div>
        
        {behavior.needsAssistance && (
          <div className="col-span-2">
            <Badge variant="destructive" className="text-xs">
              Assistance Active
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
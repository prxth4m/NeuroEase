"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Type, 
  Eye, 
  Focus, 
  Palette, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Play,
  Pause
} from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useUserBehavior } from '@/contexts/UserBehaviorContext';

export default function AccessibilityControls() {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const { behavior, isTracking, toggleTracking } = useUserBehavior();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Reading Assist
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={behavior.focusLevel === 'high' ? 'default' : 'secondary'}>
                {behavior.focusLevel}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTracking}
                className="p-1"
              >
                {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-6">
            {/* Typography Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <Label className="font-medium">Typography</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Font Size</Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSettings({ fontSize: value })}
                    min={12}
                    max={32}
                    step={1}
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">{settings.fontSize}px</span>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Line Height</Label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={([value]) => updateSettings({ lineHeight: value })}
                    min={1.2}
                    max={2.5}
                    step={0.1}
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">{settings.lineHeight}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Font Family</Label>
                <Select 
                  value={settings.fontFamily} 
                  onValueChange={(value: any) => updateSettings({ fontFamily: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Sans</SelectItem>
                    <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vision Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <Label className="font-medium">Vision Support</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Contrast</Label>
                  <Select 
                    value={settings.contrast} 
                    onValueChange={(value: any) => updateSettings({ contrast: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High Contrast</SelectItem>
                      <SelectItem value="inverted">Inverted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Background</Label>
                  <Select 
                    value={settings.backgroundTint} 
                    onValueChange={(value: any) => updateSettings({ backgroundTint: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="blue">Blue Tint</SelectItem>
                      <SelectItem value="yellow">Yellow Tint</SelectItem>
                      <SelectItem value="green">Green Tint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Focus Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Focus className="w-4 h-4" />
                <Label className="font-medium">Focus Assistance</Label>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Focus Mode</Label>
                <Select 
                  value={settings.focusMode} 
                  onValueChange={(value: any) => updateSettings({ focusMode: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Focus</SelectItem>
                    <SelectItem value="line">Line Focus</SelectItem>
                    <SelectItem value="sentence">Sentence Focus</SelectItem>
                    <SelectItem value="paragraph">Paragraph Focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Enable Focus Window</Label>
                <Switch
                  checked={settings.enableFocusWindow}
                  onCheckedChange={(checked) => updateSettings({ enableFocusWindow: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Bionic Reading</Label>
                <Switch
                  checked={settings.enableBionic}
                  onCheckedChange={(checked) => updateSettings({ enableBionic: checked })}
                />
              </div>
            </div>

            {/* Advanced Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <Label className="font-medium">Advanced</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
                  <Slider
                    value={[settings.letterSpacing]}
                    onValueChange={([value]) => updateSettings({ letterSpacing: value })}
                    min={-1}
                    max={4}
                    step={0.5}
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">{settings.letterSpacing}px</span>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Word Spacing</Label>
                  <Slider
                    value={[settings.wordSpacing]}
                    onValueChange={([value]) => updateSettings({ wordSpacing: value })}
                    min={0}
                    max={8}
                    step={1}
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">{settings.wordSpacing}px</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
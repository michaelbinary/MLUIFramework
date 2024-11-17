// src/components/training/TrainingProgress.tsx (continued)
// src/components/training/TrainingProgress.tsx

import React from 'react';
import { Activity, Timer, TrendingDown, Zap } from 'lucide-react';

interface TrainingProgressProps {
  epoch: number;
  totalEpochs?: number;
  loss: number;
  accuracy: number;
  learningRate: number;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  epoch,
  totalEpochs = 100,
  loss,
  accuracy,
  learningRate,
  theme = 'light',
variant = 'default'
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg p-4
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
    ${isDark ? 'border-neutral-800' : 'border-neutral-200'}
  `;

  const progressPercentage = (epoch / totalEpochs) * 100;

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Training Progress</span>
            </div>
            <span className="text-sm text-neutral-500">
              Epoch {epoch}/{totalEpochs}
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`${baseClasses} border space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-neutral-500" />
            <span className="font-medium">Training Progress</span>
          </div>
          <span className="text-sm text-neutral-500">
            Epoch {epoch}/{totalEpochs}
          </span>
        </div>
        
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">Loss</span>
            </div>
            <span className="text-lg font-mono">{loss.toFixed(4)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">Accuracy</span>
            </div>
            <span className="text-lg font-mono">{(accuracy * 100).toFixed(2)}%</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">Learning Rate</span>
            </div>
            <span className="text-lg font-mono">{learningRate.toExponential(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${baseClasses} border`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-neutral-500" />
            <span className="font-medium">Training Progress</span>
          </div>
          <span className="text-sm text-neutral-500">
            Epoch {epoch}/{totalEpochs}
          </span>
        </div>

        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-neutral-500" />
            <div>
              <span className="text-sm text-neutral-500">Loss</span>
              <div className="font-mono">{loss.toFixed(4)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-neutral-500" />
            <div>
              <span className="text-sm text-neutral-500">Accuracy</span>
              <div className="font-mono">{(accuracy * 100).toFixed(2)}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-neutral-500" />
            <div>
              <span className="text-sm text-neutral-500">LR</span>
              <div className="font-mono">{learningRate.toExponential(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgress;
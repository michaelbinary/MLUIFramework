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

const TrainingProgress: React.FC<TrainingProgressProps> = ({
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
    rounded-lg p-4 border
    ${isDark ? 'bg-neutral-900 text-white border-neutral-800' : 'bg-white text-neutral-900 border-neutral-200'}
  `;

  const progressPercentage = (epoch / totalEpochs) * 100;

  // Function to render metric items to avoid redundancy
  const renderMetric = (icon: React.ReactNode, label: string, value: string) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-neutral-500">{label}</span>
      </div>
      <span className="text-lg font-mono">{value}</span>
    </div>
  );

  return (
    <div className={baseClasses}>
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

        {variant !== 'compact' && (
          <div className={`grid ${variant === 'detailed' ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
            {renderMetric(<TrendingDown className="h-4 w-4 text-neutral-500" />, 'Loss', loss.toFixed(4))}
            {renderMetric(<Timer className="h-4 w-4 text-neutral-500" />, 'Accuracy', `${(accuracy * 100).toFixed(2)}%`)}
            {renderMetric(<Zap className="h-4 w-4 text-neutral-500" />, 'Learning Rate', learningRate.toExponential(2))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingProgress;

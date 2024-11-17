// @ts-nocheck

// src/components/metrics/ModelMetrics.tsx

import React from 'react';
import { CheckCircle, AlertTriangle, Library, Target } from 'lucide-react';

interface MetricsData {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc?: number;
  logloss?: number;
}

interface ModelMetricsProps {
  metrics: MetricsData;
  variant?: 'default' | 'compact' | 'detailed';
  theme?: 'light' | 'dark';
  showVisuals?: boolean;
}

const formatMetric = (value: number): string => {
  return (value * 100).toFixed(1) + '%';
};

const getScoreColor = (value: number): string => {
  if (value >= 0.9) return 'text-emerald-500';
  if (value >= 0.7) return 'text-amber-500';
  return 'text-rose-500';
};

export const ModelMetrics: React.FC<ModelMetricsProps> = ({
  metrics,
  variant = 'default',
  theme = 'light',
  showVisuals = true
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg p-4
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
    ${isDark ? 'border-neutral-800' : 'border-neutral-200'}
  `;

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-medium">Model Performance</span>
            </div>
            <div className={`text-2xl font-mono ${getScoreColor(metrics.f1Score)}`}>
              {formatMetric(metrics.f1Score)}
            </div>
          </div>
          {showVisuals && (
            <div className={`h-8 w-8 ${getScoreColor(metrics.f1Score)}`}>
              {metrics.f1Score >= 0.9 ? (
                <CheckCircle className="h-full w-full" />
              ) : (
                <AlertTriangle className="h-full w-full" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`${baseClasses} border space-y-4`}>
        <div className="flex items-center gap-2">
          <Library className="h-5 w-5 text-neutral-500" />
          <span className="font-medium">Detailed Metrics</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Accuracy', value: metrics.accuracy },
            { label: 'Precision', value: metrics.precision },
            { label: 'Recall', value: metrics.recall },
            { label: 'F1 Score', value: metrics.f1Score },
            ...(metrics.auc ? [{ label: 'AUC', value: metrics.auc }] : []),
            ...(metrics.logloss ? [{ label: 'Log Loss', value: metrics.logloss }] : [])
          ].map((metric, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-sm text-neutral-500">{metric.label}</span>
              <div className={`text-lg font-mono ${getScoreColor(metric.value)}`}>
                {formatMetric(metric.value)}
              </div>
            </div>
          ))}
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
            <Target className="h-5 w-5 text-neutral-500" />
            <span className="font-medium">Model Metrics</span>
          </div>
          {showVisuals && (
            <div className={`h-6 w-6 ${getScoreColor(metrics.f1Score)}`}>
              {metrics.f1Score >= 0.9 ? (
                <CheckCircle className="h-full w-full" />
              ) : (
                <AlertTriangle className="h-full w-full" />
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Accuracy</span>
            <span className={`font-mono ${getScoreColor(metrics.accuracy)}`}>
              {formatMetric(metrics.accuracy)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Precision</span>
            <span className={`font-mono ${getScoreColor(metrics.precision)}`}>
              {formatMetric(metrics.precision)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Recall</span>
            <span className={`font-mono ${getScoreColor(metrics.recall)}`}>
              {formatMetric(metrics.recall)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">F1 Score</span>
            <span className={`font-mono ${getScoreColor(metrics.f1Score)}`}>
              {formatMetric(metrics.f1Score)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;
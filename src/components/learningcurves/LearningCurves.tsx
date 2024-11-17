// @ts-nocheck

// src/components/learningcurves/LearningCurves.tsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ReferenceArea,
  Brush
} from 'recharts';
import { TrendingUp, Download, Maximize2, Filter, Info } from 'lucide-react';

interface MetricData {
  name: string;
  train: number;
  validation: number;
  confidenceLow?: number;
  confidenceHigh?: number;
}

interface LearningCurvesProps {
  data: MetricData[];
  metrics?: string[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showConfidence?: boolean;
  showBrush?: boolean;
  autoScale?: boolean;
  colorScale?: 'blue' | 'green' | 'purple';
  realTime?: boolean;
  smoothing?: number;
}

const colors = {
  blue: {
    train: '#3B82F6',
    validation: '#93C5FD',
    confidence: '#DBEAFE'
  },
  green: {
    train: '#10B981',
    validation: '#6EE7B7',
    confidence: '#D1FAE5'
  },
  purple: {
    train: '#8B5CF6',
    validation: '#C4B5FD',
    confidence: '#EDE9FE'
  }
};

const formatValue = (value: number): string => {
  if (value < 0.01) return value.toExponential(2);
  return value.toFixed(3);
};

export const LearningCurves: React.FC<LearningCurvesProps> = ({
  data,
  metrics = ['loss'],
  theme = 'light',
  variant = 'default',
  showConfidence = true,
  showBrush = false,
  autoScale = true,
  colorScale = 'blue',
  realTime = false,
  smoothing = 0
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const selectedColors = colors[colorScale];

  // Apply smoothing if needed
  const smoothedData = React.useMemo(() => {
    if (smoothing === 0) return data;

    return data.map((point, idx) => {
      if (smoothing === 0 || idx < smoothing) return point;

      const window = data.slice(Math.max(0, idx - smoothing), idx + 1);
      const smoothed = {
        ...point,
        train: window.reduce((sum, p) => sum + p.train, 0) / window.length,
        validation: window.reduce((sum, p) => sum + p.validation, 0) / window.length
      };

      if (point.confidenceLow !== undefined) {
        smoothed.confidenceLow = window.reduce((sum, p) => sum + (p.confidenceLow || 0), 0) / window.length;
      }
      if (point.confidenceHigh !== undefined) {
        smoothed.confidenceHigh = window.reduce((sum, p) => sum + (p.confidenceHigh || 0), 0) / window.length;
      }

      return smoothed;
    });
  }, [data, smoothing]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const point = payload[0].payload;
    return (
      <div className={`
        p-3 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <div className="space-y-1 text-sm">
          <div className="font-medium">Epoch {point.name}</div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: selectedColors.train }} />
              <span>Train:</span>
              <span className="font-mono">{formatValue(point.train)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: selectedColors.validation }} />
              <span>Val:</span>
              <span className="font-mono">{formatValue(point.validation)}</span>
            </div>
          </div>
          {showConfidence && point.confidenceLow !== undefined && (
            <div className="text-neutral-500">
              CI: [{formatValue(point.confidenceLow)} - {formatValue(point.confidenceHigh)}]
            </div>
          )}
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={smoothedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Line
                type="monotone"
                dataKey="train"
                stroke={selectedColors.train}
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="validation"
                stroke={selectedColors.validation}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Learning Curves</h3>
          {variant === 'detailed' && (
            <span className="text-sm text-neutral-500">
              Epoch {data.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {variant === 'detailed' && (
            <>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Filter className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Download className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Maximize2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={smoothedData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#525252' : '#E5E7EB'}
              />
              <XAxis
                dataKey="name"
                label={{ 
                  value: 'Epoch', 
                  position: 'bottom',
                  offset: -10
                }}
                tick={{ fontSize: 12 }}
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis
                domain={autoScale ? ['auto', 'auto'] : undefined}
                tick={{ fontSize: 12 }}
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {showConfidence && smoothedData[0].confidenceLow !== undefined && (
                <Area
                  type="monotone"
                  dataKey="confidenceLow"
                  stroke="none"
                  fill={selectedColors.confidence}
                />
              )}

              <Line
                type="monotone"
                name="Train"
                dataKey="train"
                stroke={selectedColors.train}
                dot={false}
                strokeWidth={2}
                isAnimationActive={!realTime}
              />
              <Line
                type="monotone"
                name="Validation"
                dataKey="validation"
                stroke={selectedColors.validation}
                dot={false}
                strokeWidth={2}
                isAnimationActive={!realTime}
              />

              {showBrush && (
                <Brush
                  dataKey="name"
                  height={30}
                  stroke={isDark ? '#525252' : '#E5E7EB'}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      {variant === 'detailed' && (
        <div className="px-4 pb-4">
          <div className={`
            flex items-start gap-2 text-sm rounded-lg p-3
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <Info className="h-4 w-4 text-neutral-500 mt-0.5" />
            <div className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
              {showConfidence ? 'Shaded area shows confidence intervals. ' : ''}
              {smoothing > 0 ? `Applied exponential smoothing with α=${smoothing}. ` : ''}
              Compare training and validation metrics to detect overfitting.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningCurves;
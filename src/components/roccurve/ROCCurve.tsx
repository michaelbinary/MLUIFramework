// src/components/roccurve/ROCCurve.tsx

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area
} from 'recharts';
import { Info, Download, Maximize2 } from 'lucide-react';

interface ROCPoint {
  fpr: number;  // False Positive Rate
  tpr: number;  // True Positive Rate
  threshold?: number;
}

interface ROCCurveProps {
  data: ROCPoint[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showGrid?: boolean;
  showThresholds?: boolean;
  showArea?: boolean;
  colorScale?: 'blue' | 'green' | 'purple';
}

const calculateAUC = (points: ROCPoint[]): number => {
  let auc = 0;
  for (let i = 1; i < points.length; i++) {
    auc += (points[i].fpr - points[i - 1].fpr) * 
           (points[i].tpr + points[i - 1].tpr) / 2;
  }
  return auc;
};

const formatThreshold = (threshold: number): string => {
  if (threshold < 0.01) return threshold.toExponential(2);
  return threshold.toFixed(3);
};

export const ROCCurve: React.FC<ROCCurveProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  showGrid = true,
  showThresholds = false,
  showArea = false,
  colorScale = 'blue'
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const colors = {
    blue: {
      main: '#3B82F6',
      light: '#93C5FD',
      area: '#3B82F620'
    },
    green: {
      main: '#10B981',
      light: '#6EE7B7',
      area: '#10B98120'
    },
    purple: {
      main: '#8B5CF6',
      light: '#C4B5FD',
      area: '#8B5CF620'
    }
  };

  const selectedColors = colors[colorScale];
  const auc = useMemo(() => calculateAUC(data), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const point = payload[0].payload;
    return (
      <div className={`
        p-3 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <div className="space-y-1 text-sm">
          <div className="font-medium">Threshold: {formatThreshold(point.threshold || 0)}</div>
          <div>TPR: {(point.tpr * 100).toFixed(1)}%</div>
          <div>FPR: {(point.fpr * 100).toFixed(1)}%</div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Line
                type="monotone"
                dataKey="tpr"
                stroke={selectedColors.main}
                dot={false}
                strokeWidth={2}
              />
              <ReferenceLine
                stroke={isDark ? '#525252' : '#E5E7EB'}
                strokeDasharray="3 3"
                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
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
          <h3 className="font-medium">ROC Curve</h3>
          <span className="text-sm text-neutral-500">
            AUC: {(auc * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'detailed' && (
            <>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Maximize2 className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
                <Download className="h-4 w-4" />
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
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#525252' : '#E5E7EB'} 
                />
              )}
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis
                dataKey="tpr"
                type="number"
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                stroke={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                stroke={isDark ? '#525252' : '#E5E7EB'}
                strokeDasharray="3 3"
                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
              />
              {showArea && (
                <Area
                  type="monotone"
                  dataKey="tpr"
                  stroke="none"
                  fill={selectedColors.area}
                />
              )}
              <Line
                type="monotone"
                dataKey="tpr"
                stroke={selectedColors.main}
                strokeWidth={2}
                dot={showThresholds}
                activeDot={{
                  r: 4,
                  fill: selectedColors.main,
                  stroke: isDark ? '#18181B' : '#FFFFFF',
                  strokeWidth: 2
                }}
              />
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
              The ROC curve shows the trade-off between the true positive rate (sensitivity) 
              and false positive rate (1 - specificity) at various classification thresholds. 
              The area under the curve (AUC) is {(auc * 100).toFixed(1)}%.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROCCurve;
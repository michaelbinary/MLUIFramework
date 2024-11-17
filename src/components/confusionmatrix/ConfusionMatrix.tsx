// @ts-nocheck

// src/components/metrics/ConfusionMatrix.tsx

import React from 'react';
import { Info, Maximize2, Download } from 'lucide-react';

interface ConfusionMatrixProps {
  data: number[][];
  labels: string[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  normalized?: boolean;
  showPercentages?: boolean;
  colorScale?: 'blue' | 'green' | 'purple';
}

const getColorIntensity = (value: number, maxValue: number, colorScale: string): string => {
  const intensity = Math.max(0.1, value / maxValue);
  switch (colorScale) {
    case 'green':
      return `rgba(16, 185, 129, ${intensity})`; // Emerald
    case 'purple':
      return `rgba(139, 92, 246, ${intensity})`; // Violet
    default:
      return `rgba(59, 130, 246, ${intensity})`; // Blue
  }
};

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  data,
  labels,
  theme = 'light',
  variant = 'default',
  normalized = false,
  showPercentages = false,
  colorScale = 'blue'
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  // Calculate totals and maximum value for color scaling
  const totals = {
    rows: data.map(row => row.reduce((a, b) => a + b, 0)),
    cols: data[0].map((_, i) => data.reduce((a, row) => a + row[i], 0))
  };
  const maxValue = Math.max(...data.flat());

  // Normalize data if needed
  const normalizedData = normalized
    ? data.map((row, i) => row.map(cell => cell / totals.rows[i]))
    : data;

  const formatValue = (value: number, rowTotal: number): string => {
    if (showPercentages) {
      return `${((value / rowTotal) * 100).toFixed(1)}%`;
    }
    return value.toString();
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} p-4 border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {normalizedData.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="p-2 text-center"
                      style={{
                        backgroundColor: getColorIntensity(cell, maxValue, colorScale)
                      }}
                    >
                      {formatValue(data[i][j], totals.rows[i])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const metrics = {
    accuracy: data.reduce((acc, row, i) => acc + row[i], 0) / data.flat().reduce((a, b) => a + b, 0),
    precision: labels.map((_, i) => data[i][i] / totals.cols[i]),
    recall: labels.map((_, i) => data[i][i] / totals.rows[i])
  };

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Confusion Matrix</h3>
          {variant === 'detailed' && (
            <Info className="h-4 w-4 text-neutral-500 cursor-help" />
          )}
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

      {/* Matrix */}
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`p-2 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Predicted →
                </th>
                {labels.map(label => (
                  <th key={label} className="p-2 text-sm font-medium">
                    {label}
                  </th>
                ))}
                {variant === 'detailed' && (
                  <th className="p-2 text-sm font-medium">Recall</th>
                )}
              </tr>
            </thead>
            <tbody>
              {normalizedData.map((row, i) => (
                <tr key={i}>
                  <td className={`p-2 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {labels[i]}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="p-2 text-center relative group"
                      style={{
                        backgroundColor: getColorIntensity(cell, maxValue, colorScale)
                      }}
                    >
                      <span className="relative z-10">
                        {formatValue(data[i][j], totals.rows[i])}
                      </span>
                      {variant === 'detailed' && (
                        <div className="
                          absolute inset-0 opacity-0 group-hover:opacity-100
                          flex items-center justify-center transition-opacity
                          bg-black/75 text-white text-xs p-1
                        ">
                          {labels[i]} → {labels[j]}
                        </div>
                      )}
                    </td>
                  ))}
                  {variant === 'detailed' && (
                    <td className="p-2 text-center font-mono">
                      {(metrics.recall[i] * 100).toFixed(1)}%
                    </td>
                  )}
                </tr>
              ))}
              {variant === 'detailed' && (
                <tr>
                  <td className={`p-2 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Precision
                  </td>
                  {metrics.precision.map((precision, i) => (
                    <td key={i} className="p-2 text-center font-mono">
                      {(precision * 100).toFixed(1)}%
                    </td>
                  ))}
                  <td className="p-2 text-center font-mono font-medium">
                    {(metrics.accuracy * 100).toFixed(1)}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      {variant === 'detailed' && (
        <div className="px-4 pb-4">
          <div className={`
            flex items-start gap-2 text-sm rounded-lg p-3
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <Info className="h-4 w-4 text-neutral-500 mt-0.5" />
            <div className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
              Darker colors indicate higher values. Hover over cells to see detailed predictions.
              Overall accuracy: {(metrics.accuracy * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfusionMatrix;
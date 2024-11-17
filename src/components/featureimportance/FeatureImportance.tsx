// @ts-nocheck

// src/components/featureimportance/FeatureImportance.tsx

import React, { useMemo } from 'react';
import {
  BarChart as BarChartIcon,
  Info,
  Download,
  Filter,
  SortDesc,
  Plus,
  Minus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface FeatureValue {
  name: string;
  importance: number;
  contribution?: 'positive' | 'negative';
  category?: string;
  description?: string;
  value?: string | number;
}

interface FeatureImportanceProps {
  data: FeatureValue[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  type?: 'absolute' | 'relative';
  showCategories?: boolean;
  maxFeatures?: number;
  colorScale?: 'blue' | 'green' | 'purple';
  orientation?: 'horizontal' | 'vertical';
  showValues?: boolean;
}

const formatValue = (value: number, type: 'absolute' | 'relative'): string => {
  if (type === 'relative') {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toFixed(4);
};

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  type = 'relative',
  showCategories = false,
  maxFeatures = 10,
  colorScale = 'blue',
  orientation = 'horizontal',
  showValues = true
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const colors = {
    blue: {
      positive: '#3B82F6',
      negative: '#93C5FD',
      default: '#3B82F6',
      categories: ['#3B82F6', '#93C5FD', '#DBEAFE', '#60A5FA']
    },
    green: {
      positive: '#10B981',
      negative: '#6EE7B7',
      default: '#10B981',
      categories: ['#10B981', '#6EE7B7', '#D1FAE5', '#34D399']
    },
    purple: {
      positive: '#8B5CF6',
      negative: '#C4B5FD',
      default: '#8B5CF6',
      categories: ['#8B5CF6', '#C4B5FD', '#EDE9FE', '#A78BFA']
    }
  };

  const selectedColors = colors[colorScale];

  // Process and sort data
  const processedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance));
    return sorted.slice(0, maxFeatures);
  }, [data, maxFeatures]);

  // Get unique categories if showing categories
  const categories = useMemo(() => {
    if (!showCategories) return [];
    return Array.from(new Set(data.map(d => d.category))).filter(Boolean);
  }, [data, showCategories]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const feature = payload[0].payload;
    return (
      <div className={`
        p-3 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <div className="space-y-1">
          <div className="font-medium">{feature.name}</div>
          <div>Importance: {formatValue(feature.importance, type)}</div>
          {feature.category && (
            <div>Category: {feature.category}</div>
          )}
          {feature.description && (
            <div className="text-sm text-neutral-500">{feature.description}</div>
          )}
          {feature.value !== undefined && (
            <div>Current Value: {feature.value}</div>
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
            <BarChart
              data={processedData.slice(0, 5)}
              layout={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <Bar
                dataKey="importance"
                fill={selectedColors.default}
              />
            </BarChart>
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
          <BarChartIcon className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Feature Importance</h3>
          {variant === 'detailed' && (
            <span className="text-sm text-neutral-500">
              Showing top {maxFeatures} features
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
            </>
          )}
        </div>
      </div>

      {/* Main Chart */}
      <div className="p-4">
        <div className={orientation === 'horizontal' ? 'h-[400px]' : 'h-96'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              layout={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
              margin={{
                top: 20,
                right: 20,
                left: orientation === 'horizontal' ? 120 : 40,
                bottom: orientation === 'horizontal' ? 20 : 60
              }}
            >
              {orientation === 'horizontal' ? (
                <>
                  <XAxis type="number" domain={[0, 'auto']} />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis type="number" domain={[0, 'auto']} />
                </>
              )}
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="importance"
                fill={selectedColors.default}
                radius={[4, 4, 4, 4]}
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.contribution
                        ? entry.contribution === 'positive'
                          ? selectedColors.positive
                          : selectedColors.negative
                        : showCategories && entry.category
                        ? selectedColors.categories[
                            categories.indexOf(entry.category) % selectedColors.categories.length
                          ]
                        : selectedColors.default
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      {(variant === 'detailed' && (showCategories || data.some(d => d.contribution))) && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-4">
            {data.some(d => d.contribution) && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-[#10B981]" />
                  <span className="text-sm">Positive Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-[#EF4444]" />
                  <span className="text-sm">Negative Impact</span>
                </div>
              </div>
            )}
            {showCategories && (
              <div className="flex flex-wrap items-center gap-4">
                {categories.map((category, idx) => (
                  <div key={category} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedColors.categories[idx % selectedColors.categories.length] }}
                    />
                    <span className="text-sm">{category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      {variant === 'detailed' && (
        <div className="px-4 pb-4">
          <div className={`
            flex items-start gap-2 text-sm rounded-lg p-3
            ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
          `}>
            <Info className="h-4 w-4 text-neutral-500 mt-0.5" />
            <div className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>
              Feature importance values show the relative impact of each feature on the model's predictions.
              {type === 'relative' ? ' Values are shown as percentages of total importance.' : ''} 
              {showValues && ' Hover over bars to see detailed information.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureImportance;
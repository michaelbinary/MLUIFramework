// @ts-nocheck

// src/components/dataqualitycheck/DataQualityCheck.tsx

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart
} from 'recharts';
import {
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Info,
  BarChart2,
  CircleDot,
  FileQuestion,
  ShieldAlert,
  PieChart as PieChartIcon
} from 'lucide-react';

interface DataStats {
  fieldName: string;
  dataType: string;
  totalCount: number;
  missingCount: number;
  uniqueCount: number;
  outlierCount?: number;
  distribution?: {
    value: string | number;
    count: number;
  }[];
  statistics?: {
    mean?: number;
    median?: number;
    std?: number;
    min?: number;
    max?: number;
    q1?: number;
    q3?: number;
  };
  validationRules?: {
    rule: string;
    passed: boolean;
    failureCount?: number;
  }[];
}

interface DataQualityCheckProps {
  data: DataStats[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showDistributions?: boolean;
  showValidation?: boolean;
  colorScale?: 'blue' | 'green' | 'purple';
  interactive?: boolean;
}

const calculateQualityScore = (stats: DataStats): number => {
  let score = 100;
  
  // Penalize for missing values
  const missingRatio = stats.missingCount / stats.totalCount;
  score -= missingRatio * 30;

  // Penalize for outliers
  if (stats.outlierCount) {
    const outlierRatio = stats.outlierCount / stats.totalCount;
    score -= outlierRatio * 20;
  }

  // Penalize for failed validation rules
  if (stats.validationRules) {
    const failedRules = stats.validationRules.filter(r => !r.passed).length;
    score -= (failedRules / stats.validationRules.length) * 30;
  }

  return Math.max(0, Math.min(100, score));
};

const formatValue = (value: number | string, type: string): string => {
  if (typeof value === 'number') {
    switch (type) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(2);
      default:
        return value.toLocaleString();
    }
  }
  return String(value);
};

export const DataQualityCheck: React.FC<DataQualityCheckProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  showDistributions = true,
  showValidation = true,
  colorScale = 'blue',
  interactive = true
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
      scale: ['#DBEAFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB']
    },
    green: {
      main: '#10B981',
      light: '#6EE7B7',
      scale: ['#D1FAE5', '#6EE7B7', '#34D399', '#10B981', '#059669']
    },
    purple: {
      main: '#8B5CF6',
      light: '#C4B5FD',
      scale: ['#EDE9FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED']
    }
  };

  const selectedColors = colors[colorScale];

  const renderQualityIndicator = (score: number) => {
    const getColor = (score: number) => {
      if (score >= 90) return 'text-emerald-500';
      if (score >= 70) return 'text-amber-500';
      return 'text-rose-500';
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`text-2xl font-mono ${getColor(score)}`}>
          {score.toFixed(1)}%
        </div>
        <div className="h-2 w-24 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  const renderDistribution = (stats: DataStats) => {
    if (!stats.distribution) return null;

    if (stats.dataType === 'categorical') {
      return (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.distribution}
                dataKey="count"
                nameKey="value"
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={2}
              >
                {stats.distribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={selectedColors.scale[index % selectedColors.scale.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className={`
                      p-2 rounded-lg shadow-lg border
                      ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
                    `}>
                      <div className="text-sm">
                        <div className="font-medium">{data.value}</div>
                        <div>Count: {data.count}</div>
                        <div>
                          {((data.count / stats.totalCount) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.distribution}>
            <CartesianGrid 
              strokeDasharray="3 3"
              stroke={isDark ? '#525252' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="value"
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className={`
                    p-2 rounded-lg shadow-lg border
                    ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
                  `}>
                    <div className="text-sm">
                      <div className="font-medium">
                        {formatValue(data.value, stats.dataType)}
                      </div>
                      <div>Count: {data.count}</div>
                      <div>
                        {((data.count / stats.totalCount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill={selectedColors.main}>
              {stats.distribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={selectedColors.scale[index % selectedColors.scale.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderStatistics = (stats: DataStats['statistics']) => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-neutral-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="font-mono">
              {formatValue(value, 'decimal')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderValidationRules = (rules: DataStats['validationRules']) => {
    if (!rules) return null;

    return (
      <div className="space-y-2">
        {rules.map((rule, idx) => (
          <div 
            key={idx}
            className={`
              flex items-start gap-2 p-2 rounded
              ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
            `}
          >
            {rule.passed ? (
              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="text-sm">{rule.rule}</div>
              {!rule.passed && rule.failureCount && (
                <div className="text-xs text-neutral-500 mt-1">
                  {rule.failureCount} violations found
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="space-y-4">
          {data.map(field => (
            <div key={field.fieldName} className="flex justify-between items-center">
              <div className="font-medium">{field.fieldName}</div>
              {renderQualityIndicator(calculateQualityScore(field))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Data Quality Analysis</h3>
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

      {/* Field Analysis */}
      <div className="divide-y divide-neutral-200">
        {data.map(field => (
          <div key={field.fieldName} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{field.fieldName}</h4>
                <div className="text-sm text-neutral-500">
                  Type: {field.dataType}
                </div>
              </div>
              {renderQualityIndicator(calculateQualityScore(field))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-neutral-500">Total Records</div>
                <div className="font-mono">{field.totalCount}</div>
              </div>
              <div>
                <div className="text-neutral-500">Missing Values</div>
                <div className="font-mono">
                  {field.missingCount} ({((field.missingCount / field.totalCount) * 100).toFixed(1)}%)
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Unique Values</div>
                <div className="font-mono">
                  {field.uniqueCount} ({((field.uniqueCount / field.totalCount) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>

            {showDistributions && field.distribution && (
              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Distribution</div>
                {renderDistribution(field)}
              </div>
            )}

            {field.statistics && variant === 'detailed' && (
              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Statistics</div>
                {renderStatistics(field.statistics)}
              </div>
            )}

            {showValidation && field.validationRules && (
              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Validation Rules</div>
                {renderValidationRules(field.validationRules)}
              </div>
            )}
          </div>
        ))}
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
              Quality scores are calculated based on missing values, outliers, and validation rule violations.
              Hover over charts and metrics for detailed information.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQualityCheck;
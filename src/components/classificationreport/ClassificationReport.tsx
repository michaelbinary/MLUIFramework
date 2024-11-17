// @ts-nocheck

// src/components/classificationreport/ClassificationReport.tsx

import React from 'react';
import {
  BarChart,
  Info,
  Download,
  Search,
  ArrowUpDown,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface ClassMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
  specificity?: number;
  accuracy?: number;
}

interface ClassificationReportProps {
  data: Record<string, ClassMetrics>;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showCharts?: boolean;
  showSearch?: boolean;
  sortable?: boolean;
  metrics?: Array<'precision' | 'recall' | 'f1Score' | 'support' | 'specificity' | 'accuracy'>;
}

const defaultMetrics = ['precision', 'recall', 'f1Score', 'support'];

const metricLabels: Record<string, string> = {
  precision: 'Precision',
  recall: 'Recall',
  f1Score: 'F1 Score',
  support: 'Support',
  specificity: 'Specificity',
  accuracy: 'Accuracy'
};

const formatMetric = (value: number, metric: string): string => {
  if (metric === 'support') return value.toLocaleString();
  return (value * 100).toFixed(1) + '%';
};

const getMetricColor = (value: number): string => {
  if (value >= 0.9) return 'text-emerald-500';
  if (value >= 0.7) return 'text-amber-500';
  return 'text-rose-500';
};

const calculateMacroAverage = (data: Record<string, ClassMetrics>, metric: string): number => {
  const values = Object.values(data).map(m => m[metric as keyof ClassMetrics] as number);
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const calculateWeightedAverage = (
  data: Record<string, ClassMetrics>,
  metric: string
): number => {
  const totalSupport = Object.values(data).reduce((sum, m) => sum + m.support, 0);
  const weightedSum = Object.values(data).reduce(
    (sum, m) => sum + (m[metric as keyof ClassMetrics] as number) * m.support,
    0
  );
  return weightedSum / totalSupport;
};

export const ClassificationReport: React.FC<ClassificationReportProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  showCharts = true,
  showSearch = false,
  sortable = true,
  metrics = defaultMetrics
}) => {
  const isDark = theme === 'dark';
  const baseClasses = `
    rounded-lg
    ${isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
  `;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter and sort data
  const processedData = React.useMemo(() => {
    let entries = Object.entries(data);
    
    // Filter based on search
    if (searchQuery) {
      entries = entries.filter(([label]) => 
        label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort based on current config
    if (sortConfig) {
      entries.sort(([, a], [, b]) => {
        const aValue = a[sortConfig.key as keyof ClassMetrics] as number;
        const bValue = b[sortConfig.key as keyof ClassMetrics] as number;
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
    }

    return Object.fromEntries(entries);
  }, [data, searchQuery, sortConfig]);

  const handleSort = (metric: string) => {
    if (!sortable) return;
    
    setSortConfig(current => {
      if (!current || current.key !== metric) {
        return { key: metric, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key: metric, direction: 'asc' };
      }
      return null;
    });
  };

  const renderSortIcon = (metric: string) => {
    if (!sortable) return null;
    if (!sortConfig || sortConfig.key !== metric) {
      return <ArrowUpDown className="h-4 w-4 text-neutral-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <SortAsc className="h-4 w-4" />
      : <SortDesc className="h-4 w-4" />;
  };

  const renderMetricBar = (value: number) => {
    if (!showCharts) return null;
    return (
      <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-current"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left p-1 font-medium">Class</th>
              {metrics.map(metric => (
                <th key={metric} className="text-right p-1 font-medium">
                  {metricLabels[metric]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData).map(([label, metrics], idx) => (
              <tr key={label} className={idx % 2 === 0 ? '' : 'bg-neutral-50'}>
                <td className="p-1">{label}</td>
                {Object.entries(metrics)
                  .filter(([key]) => defaultMetrics.includes(key))
                  .map(([key, value]) => (
                    <td key={key} className="text-right p-1">
                      {formatMetric(value, key)}
                    </td>
                  ))
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Classification Report</h3>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'detailed' && (
            <button className={`p-1.5 rounded-md hover:bg-neutral-100 ${isDark ? 'hover:bg-neutral-800' : ''}`}>
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-md border
                ${isDark 
                  ? 'bg-neutral-800 border-neutral-700 text-white' 
                  : 'bg-white border-neutral-200 text-neutral-900'}
              `}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          </div>
        </div>
      )}

      {/* Metrics Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`
              border-b
              ${isDark ? 'border-neutral-700' : 'border-neutral-200'}
            `}>
              <th className="text-left p-2 font-medium">Class</th>
              {metrics.map(metric => (
                <th 
                  key={metric}
                  onClick={() => handleSort(metric)}
                  className={`
                    text-right p-2 font-medium
                    ${sortable ? 'cursor-pointer hover:bg-neutral-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-end gap-2">
                    {metricLabels[metric]}
                    {renderSortIcon(metric)}
                  </div>
                </th>
              ))}
              {showCharts && <th className="w-24" />}
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData).map(([label, classMetrics], idx) => (
              <tr 
                key={label}
                className={`
                  border-b last:border-0
                  ${isDark ? 'border-neutral-800' : 'border-neutral-200'}
                  ${idx % 2 === 0 ? '' : isDark ? 'bg-neutral-800/50' : 'bg-neutral-50/50'}
                `}
              >
                <td className="p-2 font-medium">{label}</td>
                {metrics.map(metric => {
                  const value = classMetrics[metric as keyof ClassMetrics] as number;
                  return (
                    <td 
                      key={metric}
                      className={`text-right p-2 ${
                        metric !== 'support' ? getMetricColor(value) : ''
                      }`}
                    >
                      {formatMetric(value, metric)}
                    </td>
                  );
                })}
                {showCharts && (
                  <td className="p-2">
                    {renderMetricBar(classMetrics.f1Score)}
                  </td>
                )}
              </tr>
            ))}
            
            {/* Averages */}
            {variant === 'detailed' && (
              <>
                <tr className={`
                  border-t
                  ${isDark ? 'border-neutral-700 bg-neutral-800/50' : 'border-neutral-200 bg-neutral-50/50'}
                `}>
                  <td className="p-2 font-medium">Macro Avg</td>
                  {metrics.map(metric => {
                    const value = calculateMacroAverage(data, metric);
                    return (
                      <td 
                        key={metric}
                        className={`text-right p-2 ${
                          metric !== 'support' ? getMetricColor(value) : ''
                        }`}
                      >
                        {formatMetric(value, metric)}
                      </td>
                    );
                  })}
                  {showCharts && <td />}
                </tr>
                <tr className={`
                  ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-50/50'}
                `}>
                  <td className="p-2 font-medium">Weighted Avg</td>
                  {metrics.map(metric => {
                    const value = calculateWeightedAverage(data, metric);
                    return (
                      <td 
                        key={metric}
                        className={`text-right p-2 ${
                          metric !== 'support' ? getMetricColor(value) : ''
                        }`}
                      >
                        {formatMetric(value, metric)}
                      </td>
                    );
                  })}
                  {showCharts && <td />}
                </tr>
              </>
            )}
          </tbody>
        </table>
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
              Metrics are color-coded based on performance: 
              <span className="text-emerald-500 ml-1">≥90%</span>,
              <span className="text-amber-500 ml-1">≥70%</span>,
              <span className="text-rose-500 ml-1">&lt;70%</span>.
              Support shows the number of samples for each class.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassificationReport;
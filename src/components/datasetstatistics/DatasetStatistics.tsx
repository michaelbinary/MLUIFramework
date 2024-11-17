import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Database,

  PieChart as PieChartIcon,
  AlertCircle,
} from 'lucide-react';

interface FeatureStats {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime';
  stats: {
    count: number;
    missing: number;
    unique: number;
    mean?: number;
    std?: number;
    min?: number;
    max?: number;
    median?: number;
    mode?: string | number;
    distribution: Array<{ value: string | number; count: number }>;
    correlations?: Record<string, number>;
  };
  quality: {
    completeness: number;
    uniqueness: number;
    issues?: Array<{
      type: 'warning' | 'error';
      message: string;
    }>;
  };
}

interface DatasetStatisticsProps {
  features: FeatureStats[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'blue' | 'green' | 'purple';
  showCorrelations?: boolean;
  showDistributions?: boolean;
  showQualityMetrics?: boolean;
}

const colors = {
  blue: {
    primary: '#3B82F6',
    secondary: '#93C5FD',
    accent: '#2563EB',
    muted: '#DBEAFE',
    background: '#EFF6FF'
  },
  green: {
    primary: '#10B981',
    secondary: '#6EE7B7',
    accent: '#059669',
    muted: '#D1FAE5',
    background: '#ECFDF5'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#C4B5FD',
    accent: '#7C3AED',
    muted: '#EDE9FE',
    background: '#F5F3FF'
  }
};

export const DatasetStatistics: React.FC<DatasetStatisticsProps> = ({
  features,
  theme = 'light',
  variant = 'default',
  colorScale = 'blue',
  showCorrelations = true,
  showDistributions = true,
  showQualityMetrics = true
}) => {
  const isDark = theme === 'dark';
  const colorPalette = colors[colorScale];

  const datasetSummary = useMemo(() => {
    const totalFeatures = features.length;
    const numericFeatures = features.filter(f => f.type === 'numeric').length;
    const categoricalFeatures = features.filter(f => f.type === 'categorical').length;
    const datetimeFeatures = features.filter(f => f.type === 'datetime').length;
    
    const totalRows = features[0]?.stats.count || 0;
    const completeness = features.reduce(
      (acc, f) => acc + (f.quality.completeness * 100), 0
    ) / features.length;

    return {
      totalFeatures,
      numericFeatures,
      categoricalFeatures,
      datetimeFeatures,
      totalRows,
      completeness
    };
  }, [features]);

  const renderDistribution = (feature: FeatureStats) => {
    if (feature.type === 'numeric') {
      return (
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={feature.stats.distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
            <XAxis 
              dataKey="value" 
              fontSize={12}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis 
              fontSize={12}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`
              }}
            />
            <Bar
              dataKey="count"
              fill={colorPalette.primary}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={120}>
        <PieChart>
          <Pie
            data={feature.stats.distribution}
            dataKey="count"
            nameKey="value"
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
          >
            {feature.stats.distribution.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? colorPalette.primary : colorPalette.secondary}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border ${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset Overview
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Features</div>
              <div className="text-2xl font-mono">{datasetSummary.totalFeatures}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Rows</div>
              <div className="text-2xl font-mono">{datasetSummary.totalRows.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <div className={`rounded-lg border ${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset Overview
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500">Features</div>
              <div className="text-2xl font-mono mt-1">{datasetSummary.totalFeatures}</div>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <div>Numeric: {datasetSummary.numericFeatures}</div>
                <div>Categorical: {datasetSummary.categoricalFeatures}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Rows</div>
              <div className="text-2xl font-mono mt-1">{datasetSummary.totalRows.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Completeness</div>
              <div className="text-2xl font-mono mt-1">
                {datasetSummary.completeness.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className={`rounded-lg border ${isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {feature.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {feature.type}
                  </span>
                </span>
                {feature.quality.issues?.length > 0 && (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {/* Basic Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Count</div>
                    <div className="font-mono">{feature.stats.count.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Missing</div>
                    <div className="font-mono">{feature.stats.missing}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Unique</div>
                    <div className="font-mono">{feature.stats.unique}</div>
                  </div>
                </div>

                {/* Numeric Stats */}
                {feature.type === 'numeric' && (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Mean</div>
                      <div className="font-mono">{feature.stats.mean?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Std</div>
                      <div className="font-mono">{feature.stats.std?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Min</div>
                      <div className="font-mono">{feature.stats.min?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Max</div>
                      <div className="font-mono">{feature.stats.max?.toFixed(2)}</div>
                    </div>
                  </div>
                )}

                {/* Distribution */}
                {showDistributions && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Distribution</div>
                    {renderDistribution(feature)}
                  </div>
                )}

                {/* Quality Metrics */}
                {showQualityMetrics && feature.quality.issues && feature.quality.issues.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Quality Issues</div>
                    <div className="space-y-2">
                      {feature.quality.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`text-sm p-2 rounded-md ${
                            issue.type === 'error'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {issue.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetStatistics;
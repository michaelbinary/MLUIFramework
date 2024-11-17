// src/components/driftdetector/DriftDetector.tsx

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Scatter,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Ban,
  ChevronDown,
  Download,
  Filter,
  Info,
  TrendingDown,
  TrendingUp,
  Waves
} from 'lucide-react';

interface DriftMetrics {
  timestamp: number;
  featureName: string;
  baselineStats: {
    mean: number;
    std: number;
    min: number;
    max: number;
    distribution: number[];
  };
  currentStats: {
    mean: number;
    std: number;
    min: number;
    max: number;
    distribution: number[];
  };
  driftMetrics: {
    ksDrift: number;  // Kolmogorov-Smirnov test statistic
    psi: number;      // Population Stability Index
    jsDivergence: number; // Jensen-Shannon divergence
  };
  driftStatus: 'none' | 'low' | 'medium' | 'high';
  alerts?: {
    type: 'drift' | 'anomaly' | 'quality';
    severity: 'low' | 'medium' | 'high';
    message: string;
  }[];
}

interface DriftDetectorProps {
  data: DriftMetrics[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  showDistributions?: boolean;
  showAlerts?: boolean;
  colorScale?: 'blue' | 'green' | 'purple';
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
  monitoringWindow?: number; // in hours
}

const defaultThresholds = {
  low: 0.1,
  medium: 0.2,
  high: 0.3
};

const getDriftColor = (value: number, thresholds: typeof defaultThresholds): string => {
  if (value >= thresholds.high) return 'text-rose-500';
  if (value >= thresholds.medium) return 'text-amber-500';
  if (value >= thresholds.low) return 'text-emerald-500';
  return 'text-neutral-500';
};

const getAlertIcon = (type: string, severity: string) => {
  switch (type) {
    case 'drift':
      return severity === 'high' ? TrendingUp : TrendingDown;
    case 'anomaly':
      return AlertTriangle;
    default:
      return Ban;
  }
};

export const DriftDetector: React.FC<DriftDetectorProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  showDistributions = true,
  showAlerts = true,
  colorScale = 'blue',
  thresholds = defaultThresholds,
  monitoringWindow = 24
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
      area: '#3B82F620',
      drift: {
        low: '#93C5FD',
        medium: '#60A5FA',
        high: '#2563EB'
      }
    },
    green: {
      main: '#10B981',
      light: '#6EE7B7',
      area: '#10B98120',
      drift: {
        low: '#6EE7B7',
        medium: '#34D399',
        high: '#059669'
      }
    },
    purple: {
      main: '#8B5CF6',
      light: '#C4B5FD',
      area: '#8B5CF620',
      drift: {
        low: '#C4B5FD',
        medium: '#A78BFA',
        high: '#7C3AED'
      }
    }
  };

  const selectedColors = colors[colorScale];

  const filteredData = useMemo(() => {
    const cutoff = Date.now() - monitoringWindow * 60 * 60 * 1000;
    return data.filter(d => d.timestamp > cutoff);
  }, [data, monitoringWindow]);

  const renderDistributionComparison = (baseline: number[], current: number[]) => {
    const distributionData = baseline.map((value, idx) => ({
      bin: idx,
      baseline: value,
      current: current[idx]
    }));

    return (
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={distributionData}>
            <CartesianGrid 
              strokeDasharray="3 3"
              stroke={isDark ? '#525252' : '#E5E7EB'}
            />
            <XAxis 
              dataKey="bin"
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                return (
                  <div className={`
                    p-2 rounded-lg shadow-lg border
                    ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
                  `}>
                    <div className="space-y-1 text-sm">
                      <div>Bin: {payload[0].payload.bin}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: selectedColors.main }} />
                        <span>Baseline: {payload[0].payload.baseline.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: selectedColors.light }} />
                        <span>Current: {payload[0].payload.current.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="baseline"
              fill={selectedColors.area}
              stroke={selectedColors.main}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke={selectedColors.light}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderDriftTimeline = () => {
    return (
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData}>
            <CartesianGrid 
              strokeDasharray="3 3"
              stroke={isDark ? '#525252' : '#E5E7EB'}
            />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className={`
                    p-3 rounded-lg shadow-lg border
                    ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
                  `}>
                    <div className="space-y-2">
                      <div className="font-medium">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>KS Drift: {data.driftMetrics.ksDrift.toFixed(3)}</div>
                        <div>PSI: {data.driftMetrics.psi.toFixed(3)}</div>
                        <div>JS Divergence: {data.driftMetrics.jsDivergence.toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {/* Reference areas for drift thresholds */}
            <ReferenceArea
              y1={thresholds.medium}
              y2={thresholds.high}
              fill={selectedColors.drift.medium}
              fillOpacity={0.1}
            />
            <ReferenceArea
              y1={thresholds.high}
              y2="dataMax"
              fill={selectedColors.drift.high}
              fillOpacity={0.1}
            />
            <Line
              type="monotone"
              dataKey="driftMetrics.ksDrift"
              stroke={selectedColors.main}
              dot={(props: any) => {
                const drift = props.payload.driftMetrics.ksDrift;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={drift > thresholds.high ? 6 : drift > thresholds.medium ? 4 : 3}
                    fill={
                      drift > thresholds.high 
                        ? selectedColors.drift.high 
                        : drift > thresholds.medium 
                          ? selectedColors.drift.medium 
                          : selectedColors.drift.low
                    }
                    strokeWidth={2}
                    stroke={isDark ? '#18181B' : '#FFFFFF'}
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`${baseClasses} border p-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{data[0].featureName}</div>
            <div className={getDriftColor(data[data.length - 1].driftMetrics.ksDrift, thresholds)}>
              {data[data.length - 1].driftMetrics.ksDrift.toFixed(3)}
            </div>
          </div>
          {renderDriftTimeline()}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-neutral-500" />
          <h3 className="font-medium">Drift Analysis</h3>
          <span className={`
            px-2 py-0.5 text-sm rounded-full
            ${getDriftColor(data[data.length - 1].driftMetrics.ksDrift, thresholds)}
          `}>
            {data[data.length - 1].driftStatus.toUpperCase()}
          </span>
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

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Current Drift Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-neutral-500 mb-1">KS Drift</div>
            <div className={`text-xl font-mono ${
              getDriftColor(data[data.length - 1].driftMetrics.ksDrift, thresholds)
            }`}>
              {data[data.length - 1].driftMetrics.ksDrift.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-500 mb-1">PSI</div>
            <div className={`text-xl font-mono ${
              getDriftColor(data[data.length - 1].driftMetrics.psi, thresholds)
            }`}>
              {data[data.length - 1].driftMetrics.psi.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-500 mb-1">JS Divergence</div>
            <div className={`text-xl font-mono ${
              getDriftColor(data[data.length - 1].driftMetrics.jsDivergence, thresholds)
            }`}>
              {data[data.length - 1].driftMetrics.jsDivergence.toFixed(3)}
            </div>
          </div>
        </div>

        {/* Drift Timeline */}
        <div>
          <div className="text-sm font-medium mb-2">Drift Over Time</div>
          {renderDriftTimeline()}
        </div>

        {/* Distribution Comparison */}
        {showDistributions && (
          <div>
            <div className="text-sm font-medium mb-2">Distribution Comparison</div>
            {renderDistributionComparison(
              data[data.length - 1].baselineStats.distribution,
              data[data.length - 1].currentStats.distribution
            )}
          </div>
        )}

        {/* Alerts */}
        {showAlerts && data[data.length - 1].alerts && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Alerts</div>
            {data[data.length - 1].alerts.map((alert, idx) => {
              const Icon = getAlertIcon(alert.type, alert.severity);
              return (
                <div 
                  key={idx}
                  className={`
                    flex items-start gap-2 p-3 rounded-lg
                    ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}
                  `}
                >
                  <Icon className={`
                    // src/components/driftdetector/DriftDetector.tsx (continued)

                    h-5 w-5 mt-0.5
                    ${alert.severity === 'high' ? 'text-rose-500' : 
                      alert.severity === 'medium' ? 'text-amber-500' : 
                      'text-emerald-500'}
                  `} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{alert.type} Alert</span>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${alert.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                          alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'}
                      `}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {alert.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
              Monitoring drift using Kolmogorov-Smirnov test (KS), Population Stability Index (PSI), 
              and Jensen-Shannon divergence. Thresholds: Low ({thresholds.low}), 
              Medium ({thresholds.medium}), High ({thresholds.high}).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriftDetector;
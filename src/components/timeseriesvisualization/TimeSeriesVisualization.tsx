// src/components/timeseriesvisualization/TimeSeriesVisualization.tsx
//
// This component visualizes time series data, forecasts, and related metrics.
// It supports multiple forecast types (point predictions, confidence intervals),
// seasonality decomposition, anomaly detection, and error analysis.
//
// Usage:
// ```tsx
// <TimeSeriesVisualization
//   data={timeSeriesData}
//   theme="light"
//   variant="default"
// />
// ```
//
// @author Your Name
// @version 1.0.0
// @since 1.0.0

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Download,
  Filter,
  Info,
  Calendar,
  Activity,
  Waves,
  Radio
} from 'lucide-react';

interface TimePoint {
  timestamp: number;
  actual: number;
  forecast?: number;
  lower?: number;
  upper?: number;
  trend?: number;
  seasonal?: number;
  residual?: number;
  anomaly?: boolean;
  anomalyScore?: number;
  metadata?: Record<string, any>;
}

interface Seasonality {
  period: number;
  strength: number;
  pattern: Array<{ offset: number; value: number }>;
}

interface ForecastMetrics {
  mape: number;
  rmse: number;
  mae: number;
  r2: number;
}

interface TimeSeriesData {
  name: string;
  description?: string;
  data: TimePoint[];
  seasonality?: Seasonality[];
  metrics?: ForecastMetrics;
  anomalyThreshold?: number;
}

interface TimeSeriesVisualizationProps {
  data: TimeSeriesData;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'detailed';
  colorScale?: 'blue' | 'green' | 'purple';
  showConfidenceIntervals?: boolean;
  showSeasonality?: boolean;
  showAnomalies?: boolean;
  forecastHorizon?: number;
}

const colors = {
    blue: {
      primary: '#3B82F6',
      secondary: '#2563EB', // Made darker for better visibility
      accent: '#1E40AF',
      muted: '#DBEAFE',
      background: '#EFF6FF',
      confidence: '#60A5FA40', // Increased opacity
      anomaly: '#EF4444',
      trend: '#818CF8',
      seasonal: '#34D399'
    },
    green: {
      primary: '#10B981',
      secondary: '#059669', // Made darker
      accent: '#047857',
      muted: '#D1FAE5',
      background: '#ECFDF5',
      confidence: '#34D39940', // Increased opacity
      anomaly: '#EF4444',
      trend: '#818CF8',
      seasonal: '#3B82F6'
    },
    purple: {
      primary: '#8B5CF6',
      secondary: '#6D28D9', // Made darker
      accent: '#5B21B6',
      muted: '#EDE9FE',
      background: '#F5F3FF',
      confidence: '#A78BFA40', // Increased opacity
      anomaly: '#EF4444',
      trend: '#34D399',
      seasonal: '#3B82F6'
    }
  };

export const TimeSeriesVisualization: React.FC<TimeSeriesVisualizationProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  colorScale = 'blue',
  showConfidenceIntervals = true,
  showSeasonality = true,
  showAnomalies = true,
  forecastHorizon = 30
}) => {
  const isDark = theme === 'dark';
  const colorPalette = colors[colorScale];
  
  const [selectedView, setSelectedView] = useState<'forecast' | 'decomposition' | 'anomalies'>('forecast');

  // Process data for visualization
  const processedData = useMemo(() => {
    const result = data.data.map(point => ({
      ...point,
      timestamp: new Date(point.timestamp),
      formattedDate: new Date(point.timestamp).toLocaleDateString(),
      anomalyColor: point.anomaly ? colorPalette.anomaly : 'transparent'
    }));

    return result;
  }, [data, colorPalette]);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) {
      return 'N/A';
    }
    
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  const renderForecastPlot = () => {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="formattedDate"
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={isDark ? '#9CA3AF' : '#6B7280'}
              tick={{ fontSize: 12 }}
              tickFormatter={formatValue}
            />
<Tooltip
  content={({ payload, label }) => {
    if (!payload?.length) return null;
    const point = payload[0].payload;
    return (
      <div className={`p-3 rounded-lg shadow-lg ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <div className="font-medium">{point.formattedDate}</div>
        <div className="mt-1 space-y-1 text-sm">
          {point.actual !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colorPalette.primary }} 
              />
              Actual: {formatValue(point.actual)}
            </div>
          )}
          {point.forecast !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colorPalette.secondary }} 
              />
              Forecast: {formatValue(point.forecast)}
            </div>
          )}
          {showConfidenceIntervals && point.lower !== undefined && point.upper !== undefined && (
            <div className="text-gray-500">
              CI: [{formatValue(point.lower)}, {formatValue(point.upper)}]
            </div>
          )}
        </div>
      </div>
    );
  }}
/>
            {showConfidenceIntervals && (
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill={colorPalette.confidence}
                fillOpacity={0.2}
              />
            )}
            {showConfidenceIntervals && (
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill={colorPalette.confidence}
                fillOpacity={0.2}
              />
            )}
            <Line
              type="monotone"
              dataKey="actual"
              stroke={colorPalette.primary}
              strokeWidth={2}
              dot={false}
            />
<Line
  type="monotone"
  dataKey="forecast"
  stroke={colorPalette.secondary}
  strokeWidth={3} // Increased width
  strokeDasharray="5 5"
  dot={{
    r: 4,
    fill: colorPalette.secondary,
    stroke: isDark ? '#18181B' : '#FFFFFF',
    strokeWidth: 2
  }}
/>
            {showAnomalies && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke={colorPalette.anomaly}
                strokeWidth={0}
                dot={(props: any) => {
                  const isAnomaly = props.payload.anomaly;
                  if (!isAnomaly) return null;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={colorPalette.anomaly}
                      stroke={isDark ? '#18181B' : '#FFFFFF'}
                      strokeWidth={2}
                    />
                  );
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderDecompositionPlot = () => {
    if (!data.seasonality) return null;

    return (
      <div className="space-y-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis tickFormatter={formatValue} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="trend"
                stroke={colorPalette.trend}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis tickFormatter={formatValue} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="seasonal"
                stroke={colorPalette.seasonal}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMetrics = () => {
    if (!data.metrics) return null;

    return (
      <div className="grid grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-500">MAPE</div>
          <div className="text-xl font-mono">
            {data.metrics.mape.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">RMSE</div>
          <div className="text-xl font-mono">
            {formatValue(data.metrics.rmse)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">MAE</div>
          <div className="text-xl font-mono">
            {formatValue(data.metrics.mae)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">R²</div>
          <div className="text-xl font-mono">
            {data.metrics.r2.toFixed(3)}
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border ${
        isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          <h3 className="text-base font-medium mb-4">
            {data.name}
          </h3>
          {renderForecastPlot()}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${
      isDark ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {data.name}
          </h3>
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded-md hover:bg-gray-100 ${
              isDark ? 'hover:bg-gray-800' : ''
            }`}>
              <Download className="h-4 w-4" />
            </button>
            <button className={`p-1.5 rounded-md hover:bg-gray-100 ${
              isDark ? 'hover:bg-gray-800' : ''
            }`}>
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* View Selection */}
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedView('forecast')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              selectedView === 'forecast'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Forecast
          </button>
          {showSeasonality && (
            <button
              onClick={() => setSelectedView('decomposition')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                selectedView === 'decomposition'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Decomposition
            </button>
          )}
        </div>

        {/* Main Plot */}
        {selectedView === 'forecast' ? renderForecastPlot() : renderDecompositionPlot()}

        {/* Metrics */}
        {data.metrics && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-4">Forecast Metrics</h4>
            {renderMetrics()}
          </div>
        )}

        {/* Info Footer */}
        <div className={`
          flex items-start gap-2 text-sm rounded-lg p-3
          ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
        `}>
          <Info className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            {selectedView === 'forecast' ? (
              <>
                Showing historical data and forecasts for the next {forecastHorizon} periods.
                {showConfidenceIntervals && ' Shaded area represents confidence intervals.'}
                {showAnomalies && ' Red dots indicate detected anomalies.'}
              </>
            ) : (
              'Decomposition shows the trend and seasonal components of the time series.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesVisualization;